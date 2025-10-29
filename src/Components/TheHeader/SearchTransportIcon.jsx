import React from "react";

export default function SearchTransportIcon({
  width = 16,
  height = 16,
  className,
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.9836 13.9836L11.0936 11.0936"
        stroke="#0A0A0A"
        strokeWidth="1.33177"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.32475 12.6518C10.2668 12.6518 12.6518 10.2668 12.6518 7.32475C12.6518 4.38269 10.2668 1.99768 7.32475 1.99768C4.38269 1.99768 1.99768 4.38269 1.99768 7.32475C1.99768 10.2668 4.38269 12.6518 7.32475 12.6518Z"
        stroke="#0A0A0A"
        strokeWidth="1.33177"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
