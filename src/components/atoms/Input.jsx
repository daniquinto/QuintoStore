import React from 'react';

const Input = ({ label, type = "text", name, value, onChange, placeholder, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-sm font-semibold text-brand-dark">{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-dna"
        {...props}
      />
    </div>
  );
};

export default Input;
