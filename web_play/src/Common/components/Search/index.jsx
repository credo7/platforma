import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const Search = ({ className, placeholder, updateSearch }) => {
  const history = useHistory();

  const params = new URLSearchParams(history.location.search);
  const search = params.get("search") || "";

  const [value, setValue] = useState(search);

  const handleSearch = (search) => {
    setValue(search);
    params.set("search", search);
    // history.push({ search: params.toString() });
  };

  useEffect(() => {
    updateSearch(value);
  }, [value, updateSearch]);

  return (
    <input
      className={className}
      placeholder={placeholder}
      type="text"
      value={value}
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
};

export default Search;
