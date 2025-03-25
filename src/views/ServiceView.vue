.service-view { min-height: 100vh; width: 100%; background: linear-gradient(rgba(0, 0, 0, 0.6),
rgba(0, 0, 0, 0.6)), url('/images/service-bg.jpg') center/cover no-repeat fixed; display: flex;
justify-content: center; align-items: flex-start; } @supports (-webkit-touch-callout: none) {
.service-view { background-attachment: scroll; } } .service-container { width: 100%; max-width:
1200px; margin: 2rem auto; padding: 0 max(1rem, env(safe-area-inset-left)); } .service-grid {
display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; padding:
1rem; } .service-card { background: rgba(255, 255, 255, 0.95); border-radius: 12px; padding: 1.5rem;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); transition: transform 0.3s ease; height: 100%; display:
flex; flex-direction: column; justify-content: space-between; } .service-card:hover { transform:
translateY(-5px); } @media (max-width: 768px) { .service-container { margin: 1rem auto; }
.service-grid { gap: 1rem; padding: 0.5rem; grid-template-columns: repeat(auto-fit, minmax(250px,
1fr)); } .service-card { padding: 1rem; } } @media (max-width: 480px) { .service-container { margin:
0.5rem auto; } .service-grid { grid-template-columns: 1fr; gap: 0.75rem; } }
