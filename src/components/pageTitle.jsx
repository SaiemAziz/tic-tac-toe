import React, { useEffect } from "react";
const PageTitle = ({ children }) => {
  useEffect(() => {
    document.title = children + " - Tic Tac Toe";
  }, [children]);
  return <></>;
};

export default PageTitle;
