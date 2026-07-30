<?php
// backend/helpers/gemini.php - Secure Gemini AI Integration & Resilient Fallback Engine

class GeminiAI {
    private static function getApiKey() {
        $envKey = getenv('GEMINI_API_KEY');
        if ($envKey && $envKey !== 'YOUR_GEMINI_API_KEY') {
            return $envKey;
        }
        if (isset($_ENV['GEMINI_API_KEY']) && $_ENV['GEMINI_API_KEY'] !== 'YOUR_GEMINI_API_KEY') {
            return $_ENV['GEMINI_API_KEY'];
        }
        return null;
    }

    /**
     * Process Citizen Complaint with:
     * 1. Category Classification
     * 2. Department Detection & Routing
     * 3. Priority Detection
     * 4. AI Generated Executive Summary
     * 5. Duplicate Complaint Detection
     * 6. Smart Suggested Resolution
     */
    public static function processComplaint($title, $description, $location = '', $existingComplaints = []) {
        // Feature 5: Duplicate Complaint Detection
        $duplicateInfo = self::checkDuplicate($title, $description, $location, $existingComplaints);

        $promptText = "Analyze the following citizen complaint:\nTitle: {$title}\nDescription: {$description}\nLocation: {$location}\n\n" .
            "Categorize and route this complaint accurately. Return ONLY a valid JSON object with the following schema:\n" .
            "{\n" .
            '  "department": "<One of: Public Works & Roads, Water Supply & Sewerage, Electricity Board, Sanitation & Solid Waste, Stormwater & Drainage, Public Health & Sanitation, Education & Schools, Public Transport & Traffic, Government Services & E-Governance, General & Environmental Services>",' . "\n" .
            '  "category": "<One of: Road, Water, Electricity, Garbage, Drainage, Health, Education, Transport, Government Office, Others>",' . "\n" .
            '  "priority": "<One of: Low, Medium, High, Critical>",' . "\n" .
            '  "summary": "<1-2 sentence key executive summary>",' . "\n" .
            '  "suggested_resolution": "<Actionable step-by-step field resolution for municipal officers>"' . "\n" .
            "}";

        $apiKey = self::getApiKey();

        if ($apiKey) {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

            $payload = [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $promptText]
                        ]
                    ]
                ],
                "generationConfig" => [
                    "response_mime_type" => "application/json"
                ]
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $response) {
                $result = json_decode($response, true);
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $jsonText = trim($result['candidates'][0]['content']['parts'][0]['text']);
                    $parsed = json_decode($jsonText, true);
                    if ($parsed && isset($parsed['category']) && isset($parsed['priority'])) {
                        $enriched = self::enrichWithDeptId($parsed);
                        $enriched['is_duplicate'] = $duplicateInfo['is_duplicate'];
                        $enriched['duplicate_of'] = $duplicateInfo['duplicate_of'];
                        return $enriched;
                    }
                }
            }
        }

        // Graceful Rule-Based NLP Fallback if API key is not set or network request fails
        $fallback = self::fallbackClassifier($title, $description);
        $fallback['is_duplicate'] = $duplicateInfo['is_duplicate'];
        $fallback['duplicate_of'] = $duplicateInfo['duplicate_of'];
        return $fallback;
    }

    /**
     * Feature 5: Duplicate Complaint Detection Algorithm
     */
    public static function checkDuplicate($title, $description, $location, $existingComplaints = []) {
        if (empty($existingComplaints)) {
            return ['is_duplicate' => false, 'duplicate_of' => null];
        }

        $inputTitleLower = strtolower($title);
        $inputLocLower = strtolower($location);

        foreach ($existingComplaints as $cmp) {
            $cmpTitleLower = strtolower($cmp['title']);
            $cmpLocLower = strtolower($cmp['location'] ?? '');

            // Title string similarity percentage
            similar_text($inputTitleLower, $cmpTitleLower, $titlePercent);

            if ($titlePercent > 60 || ($inputLocLower !== '' && $inputLocLower === $cmpLocLower && $titlePercent > 35)) {
                return [
                    'is_duplicate' => true,
                    'duplicate_of' => [
                        'id' => $cmp['id'],
                        'complaint_number' => $cmp['complaint_number'],
                        'title' => $cmp['title'],
                        'status' => $cmp['status']
                    ]
                ];
            }
        }

        return ['is_duplicate' => false, 'duplicate_of' => null];
    }

    // Smart Fallback Classifier based on NLP keywords & domain rules
    private static function fallbackClassifier($title, $description) {
        $text = strtolower($title . " " . $description);

        $category = 'Others';
        $departmentName = 'General & Environmental Services';
        $priority = 'Medium';
        $deptId = 10;

        // Keyword analysis
        if (preg_match('/pothole|road|asphalt|street|pavement|tar|highway|crack/i', $text)) {
            $category = 'Road';
            $departmentName = 'Public Works & Roads';
            $deptId = 1;
            $priority = (strpos($text, 'accident') !== false || strpos($text, 'deep') !== false || strpos($text, 'danger') !== false) ? 'High' : 'Medium';
        } elseif (preg_match('/water|pipe|leak|sewer|pipe burst|drinking water|tap|overflow/i', $text)) {
            $category = 'Water';
            $departmentName = 'Water Supply & Sewerage';
            $deptId = 2;
            $priority = (strpos($text, 'burst') !== false || strpos($text, 'spill') !== false) ? 'Critical' : 'High';
        } elseif (preg_match('/light|electricity|power|transformer|wire|outage|spark|voltage/i', $text)) {
            $category = 'Electricity';
            $departmentName = 'Electricity Board';
            $deptId = 3;
            $priority = (strpos($text, 'spark') !== false || strpos($text, 'wire') !== false) ? 'Critical' : 'Medium';
        } elseif (preg_match('/garbage|trash|waste|smell|dump|odor|litter|bins|dumpster/i', $text)) {
            $category = 'Garbage';
            $departmentName = 'Sanitation & Solid Waste';
            $deptId = 4;
            $priority = (strpos($text, 'market') !== false || strpos($text, 'days') !== false) ? 'High' : 'Medium';
        } elseif (preg_match('/drain|flooding|monsoon|stormwater|gutter|culvert|canal/i', $text)) {
            $category = 'Drainage';
            $departmentName = 'Stormwater & Drainage';
            $deptId = 5;
            $priority = (strpos($text, 'house') !== false || strpos($text, 'overflow') !== false) ? 'Critical' : 'High';
        } elseif (preg_match('/mosquito|dengue|hospital|clinic|health|disease|animal|dog/i', $text)) {
            $category = 'Health';
            $departmentName = 'Public Health & Sanitation';
            $deptId = 6;
            $priority = 'High';
        } elseif (preg_match('/school|student|education|library|class|teacher/i', $text)) {
            $category = 'Education';
            $departmentName = 'Education & Schools';
            $deptId = 7;
            $priority = 'Medium';
        } elseif (preg_match('/bus|stop|transit|traffic|signal|parking|vehicle/i', $text)) {
            $category = 'Transport';
            $departmentName = 'Public Transport & Traffic';
            $deptId = 8;
            $priority = 'Medium';
        } elseif (preg_match('/certificate|bribe|officer|delay|counter|stamp|government/i', $text)) {
            $category = 'Government Office';
            $departmentName = 'Government Services & E-Governance';
            $deptId = 9;
            $priority = 'Medium';
        }

        // Summary generation
        $summary = "Issue regarding " . strtolower($category) . ": " . (strlen($title) > 65 ? substr($title, 0, 62) . '...' : $title);

        // Suggested resolution
        $resolutions = [
            'Road' => 'Dispatch PWD maintenance squad with cold-mix asphalt and set up safety cones.',
            'Water' => 'Isolate main valve, inspect pipeline pressure, and replace broken coupling joint.',
            'Electricity' => 'Inspect area circuit breaker/transformer and dispatch electrical crew.',
            'Garbage' => 'Send heavy compactor vehicle for immediate waste clearance and spray sanitizing lime.',
            'Drainage' => 'Deploy suction jetting vehicle to clear blocked underground drain lines.',
            'Health' => 'Deploy health team for chemical fogging or vector control operation.',
            'Education' => 'Forward complaint to Municipal Education Supervisor for school site visit.',
            'Transport' => 'Send traffic signal repair technician or transit enforcement unit.',
            'Government Office' => 'Direct to Nodal Administrative Officer for queue and service resolution.',
            'Others' => 'Assign field inspector from General Services for preliminary site assessment.'
        ];

        return [
            'department' => $departmentName,
            'department_id' => $deptId,
            'category' => $category,
            'priority' => $priority,
            'summary' => $summary,
            'suggested_resolution' => isset($resolutions[$category]) ? $resolutions[$category] : $resolutions['Others']
        ];
    }

    private static function enrichWithDeptId($parsed) {
        $map = [
            'Public Works & Roads' => 1,
            'Water Supply & Sewerage' => 2,
            'Electricity Board' => 3,
            'Sanitation & Solid Waste' => 4,
            'Stormwater & Drainage' => 5,
            'Public Health & Sanitation' => 6,
            'Education & Schools' => 7,
            'Public Transport & Traffic' => 8,
            'Government Services & E-Governance' => 9,
            'General & Environmental Services' => 10
        ];

        $deptName = isset($parsed['department']) ? $parsed['department'] : 'General & Environmental Services';
        $parsed['department_id'] = isset($map[$deptName]) ? $map[$deptName] : 10;
        return $parsed;
    }

    /**
     * Feature 7: AI Chat Assistant Engine (Secure Gemini Calling with Resilient Conversational Logic)
     */
    public static function generateChatResponse($userMessage, $contextComplaints = []) {
        $apiKey = self::getApiKey();

        if ($apiKey) {
            $contextText = "";
            if (!empty($contextComplaints)) {
                $contextText = "User's Complaints Context:\n";
                foreach (array_slice($contextComplaints, 0, 3) as $c) {
                    $contextText .= "- Ticket #" . ($c['complaint_number'] ?? 'N/A') . ": " . ($c['title'] ?? '') . " | Status: " . ($c['status'] ?? '') . " | Dept: " . ($c['department_name'] ?? '') . "\n";
                }
            }

            $prompt = "You are CivicAI Copilot, an official intelligent AI assistant for municipal governance.\n" .
                "Answer citizen and officer questions helpfully, professionally, and concisely (2-3 sentences max).\n\n" .
                $contextText . "\nUser Message: " . $userMessage;

            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $apiKey;

            $payload = [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt]
                        ]
                    ]
                ]
            ];

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_TIMEOUT, 6);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $response) {
                $result = json_decode($response, true);
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    return trim($result['candidates'][0]['content']['parts'][0]['text']);
                }
            }
        }

        // Resilient Chat Fallback
        $msgLower = strtolower($userMessage);

        if (strpos($msgLower, 'status') !== false || strpos($msgLower, 'track') !== false || strpos($msgLower, 'update') !== false) {
            if (!empty($contextComplaints)) {
                $latest = $contextComplaints[0];
                return "Your most recent complaint #" . $latest['complaint_number'] . " (" . $latest['title'] . ") is currently **" . $latest['status'] . "** with " . ($latest['department_name'] ?? 'assigned department') . ".";
            }
            return "To check your complaint status, please view your Complaint History tab or provide your Complaint Reference Number (e.g., CIV-2026-001).";
        }

        if (strpos($msgLower, 'how to submit') !== false || strpos($msgLower, 'file complaint') !== false || strpos($msgLower, 'new complaint') !== false) {
            return "You can easily submit a new complaint by clicking the **Submit Complaint** button in your sidebar menu. You can upload photo proof, select your location, or use voice input to dictate your problem!";
        }

        if (strpos($msgLower, 'emergency') !== false || strpos($msgLower, 'danger') !== false) {
            return "If this is a life-threatening emergency or immediate hazard, please call municipal emergency response at **1800-CIVIC-911** alongside filing your Critical priority ticket.";
        }

        return "I am your CivicAI Assistant! I can help you lodge complaints, track status updates, find municipal department guidelines, or explain our AI automated routing process. How may I assist you today?";
    }
}
