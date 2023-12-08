import React from 'react';

const DropdownMenu = ({ groups, onSelect }) => {
  return (
    <div className="dropdown-menu">
      <p>Select a group:</p>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="" disabled selected>Select a group</option>
        {groups.map((group) => (
          <option key={group.group_id} value={group.group_id}>
            {group.groupname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownMenu;