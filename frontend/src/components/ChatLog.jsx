export const ChatLog = ({ chatLog }) => {
    return (
        <div
            style={{
                border: '1px solid #ccc',
                padding: '1rem',
                marginBottom: '1rem',
                height: '300px',
                overflowY: 'scroll',
            }}
        >
            {chatLog.map((entry, index) => (
                <p
                    key={index}
                    style={{ color: entry.user === 'nular' ? 'yellow' : 'green' }}
                >
                    <strong>{entry.user}:</strong> {entry.message}
                </p>
            ))}
        </div>
    );
}