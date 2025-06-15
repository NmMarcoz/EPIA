import type { Worker } from "../../utils/types/EpiaTypes";

interface GreetingCardProps {
  worker: Worker;
}

const GreetingCard: React.FC<GreetingCardProps> = ({ worker }) => (
  <div
    style={{
      borderRadius: 12,
      border: '1px solid #e5e7eb',
      background: '#fff',
      color: '#1f2937',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      maxWidth: 420,
      margin: '32px auto 0',
      padding: 0,
      marginBottom: 0
    }}
  >
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 8  }}>
      <h2 style={{ fontSize: 48, fontWeight: 600, marginBottom: 4, letterSpacing: -0.5 }}>
        Bem-vindo, {worker.name}!
      </h2>
      <div style={{ color: '#6b7280', fontSize: 15 }}>
        Matrícula: <span style={{ color: '#111', fontWeight: 500 }}>{worker.registrationNumber}</span><br />
        Função: <span style={{ color: '#111', fontWeight: 500 }}>{worker.function}</span><br />
        E-mail: <span style={{ color: '#111', fontWeight: 500 }}>{worker.email}</span><br />
        Tipo: <span style={{ color: '#111', fontWeight: 500 }}>{worker.type}</span>
      </div>
    </div>
  </div>
);

export default GreetingCard;