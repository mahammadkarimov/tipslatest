// components/LoadingScreen.tsx
export  function LoadingScreen() {
    return (
      <div className="fixed inset-0 flex gap-[10px] items-center justify-center bg-white z-50">
        <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #f3f3f3',
            borderTop: '5px solid red',
            borderRadius: '50%',
            animation: 'spin 2s linear infinite'
        }}></div>
        <p>Loading...</p>
      </div>
    );
  }
  