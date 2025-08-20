import React from "react";

const InputWithIcon = ({ type, name, placeholder, Icon, value, onChange }) => {
  return (
    <div className="relative mb-4 w-full max-w-[24rem]">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default InputWithIcon;
