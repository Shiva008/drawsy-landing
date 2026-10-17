"use client";

import { useState } from "react";

type PasswordInputProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  minLength?: number;
  disabled?: boolean;
  /** Controlled visibility (shared Show across fields). */
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Hide the Show/Hide control (e.g. confirm field mirrors password). */
  showToggle?: boolean;
};

export function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  placeholder = "Create Password",
  autoComplete = "current-password",
  required,
  minLength,
  disabled,
  visible: visibleProp,
  onVisibleChange,
  showToggle = true,
}: PasswordInputProps) {
  const [uncontrolledVisible, setUncontrolledVisible] = useState(false);
  const controlled = visibleProp !== undefined;
  const visible = controlled ? visibleProp : uncontrolledVisible;

  function setVisible(next: boolean) {
    if (!controlled) setUncontrolledVisible(next);
    onVisibleChange?.(next);
  }

  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-label">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          disabled={disabled}
          placeholder={placeholder}
          className={`input-drawsy${showToggle ? " has-password-toggle" : ""}`}
        />
        {showToggle ? (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            disabled={disabled}
            className="auth-password-toggle"
            aria-pressed={visible}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
