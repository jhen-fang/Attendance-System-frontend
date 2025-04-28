export default function LeaveManage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '500px',
          backgroundColor: '#fff',
          padding: '2rem 2.5rem',
          borderRadius: '14px',
          boxShadow: '0 12px 28px rgba(0,0,0,.1)',
          textAlign: 'center',
          lineHeight: 1.7,
        }}
      >
        <h2 style={{ marginBottom: '1rem', color: '#333' }}>假單管理（待開發）</h2>
        <p style={{ color: '#555' }}>這裡將提供主管審核與查詢假單的功能。</p>
      </div>
    </div>
  );
}