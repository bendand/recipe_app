export default function Input({ label, error, id, ...props }) {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} {...props} />
            <div>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}