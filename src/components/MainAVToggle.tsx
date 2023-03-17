import React, { useEffect, useRef } from "react";
interface MainAVToggleProps {
  buttonClicked: (v: string) => void;
}

function MainAVToggle(props: MainAVToggleProps) {
  const buttonClicked = (value: string) => {
    props.buttonClicked(value);
  };
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        onClick={() => buttonClicked("audio")}
        type="button"
        className="px-4 py-2 text-sm font-medium text-blue-700 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        Audio
      </button>
      <button
        onClick={() => buttonClicked("video")}
        type="button"
        className="px-4 py-2 text-sm font-medium text-emerald-600 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-emerald-700 focus:z-10 focus:ring-2 focus:ring-emerald-700 focus:text-emerald-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-emerald-500 dark:focus:text-white"
      >
        Video
      </button>
    </div>
  );
}

export default MainAVToggle;
