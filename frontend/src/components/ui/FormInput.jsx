import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const FormInput = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  icon: Icon,
  rows,
  options,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputClass = `w-full h-9 px-3 border rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white transition-colors focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed ${error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
      : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
    } ${Icon ? 'pl-9' : ''} ${isPassword ? 'pr-9' : ''}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows || 4}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 disabled:bg-gray-50 ${error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
              }`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={inputClass}
            {...props}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClass}
            {...props}
          />
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormInput;
