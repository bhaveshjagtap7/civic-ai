<?php
// backend/helpers/gemini.php

class GeminiAI {
    private static $apiKey = "YOUR_GEMINI_API_KEY"; // Loaded dynamically if set in env or db

    public static function processComplaint($title, $description) {
        $promptText = "Analyze the following citizen complaint:\nTitle: {$title}\nDescription: {$description}\n\n" .
            "Categorize and route this complaint accurately. Return ONLY a valid JSON object with the following schema:\n" .
            "{\n" .
            '  "department": "<One of: Public Works & Roads, Water Supply & Sewerage, Electricity Board, Sanitation & Solid Waste, Stormwater & Drainage, Public Health & Sanitation, Education & Schools, Public Transport & Traffic, Government Services & E-Governance, General & Environmental Services>",' . "\n" .
            '  "category": "<One of: Road, Water, Electricity, Garbage, Drainage, Health, Education, Transport, Government Office, Others>",' . "\n" .
            '  "priority": "<One of: Low, Medium, High, Critical>",' . "\n" .
            '  "summary": "<1-2 sentence key summary>",' . "\n" .
            '  "suggested_resolution": "<Actionable field resolution for municipal officers>"' . "\n" .
            "}";

        // Check if environment GEMINI_API_KEY is present
        $envKey = getenv('GEMINI_API_KEY');
        if ($envKey && $envKey !== 'YOUR_GEMINI_API_KEY') {
            self::$apiKey = $envKey;
        }

        if (self::$apiKey && self::$apiKey !== 'YOUR_GEMINI_API_KEY') {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . self::$apiKey;
            
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
            curl_setopt($ch, CURLOPT_TIMEOUT, 8);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 && $response) {
                $result = json_decode($response, true);
                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $jsonText = trim($result['candidates'][0]['content']['parts'][0]['text']);
                    $parsed = json_decode($jsonText, true);
                    if ($parsed && isset($parsed['category']) && isset($parsed['priority'])) {
                        return self::enrichWithDeptId($parsed);
                    }
                }
            }
        }

        // Rule-based Fallback AI Classifier
        return self::fallbackClassifier($title, $description);
    }

    // Smart Fallback Classifier based on NLP keywords
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
        $summary = "Issue regarding " . strtolower($category) . ": " . (strlen($title) > 60 ? substr($title, 0, 57) . '...' : $title);

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

    // AI Citizen Assistant Assistant Chatbot response generator
    public static function generateChatResponse($userMessage, $contextComplaints = []) {
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

        return "I am your CivicAI Assistant! I can help you lodge complaints, track their status, find municipal department guidelines, or explain our AI automated routing process. How may I assist you today?";
    }
}
