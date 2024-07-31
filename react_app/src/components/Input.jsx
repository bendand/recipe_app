export default function Input({ label, error, id, ...props }) {
    return (
        <div style={{ margin: '5px' }}>
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} />
            <div>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}