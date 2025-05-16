import React, { useRef, useState } from 'react';

const ResizableSidebarLayout = ({ children, sidebarContent }) => {
  const [sidebarWidth, setSidebarWidth] = useState(250); // Initial width
  const resizerRef = useRef(null);
  const isResizing = useRef(false);

  const startResizing = (e) => {
    isResizing.current = true;
    document.addEventListener('mousemove', resizeSidebar);
    document.addEventListener('mouseup', stopResizing);
  };

  const resizeSidebar = (e) => {
    if (isResizing.current) {
      const newWidth = e.clientX;
      if (newWidth >= 150 && newWidth <= 500) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', resizeSidebar);
    document.removeEventListener('mouseup', stopResizing);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div
        style={{
          width: `${sidebarWidth}px`,
          background: '#343a40',
          color: 'white',
          padding: '1rem',
          overflowY: 'auto'
        }}
      >
        {sidebarContent}
      </div>

      {/* Resizer handle */}
      <div
        ref={resizerRef}
        onMouseDown={startResizing}
        style={{
          width: '5px',
          cursor: 'col-resize',
          background: '#aaa'
        }}
      />

      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {children}
      </div>
    </div>
  );
};

export default ResizableSidebarLayout;
