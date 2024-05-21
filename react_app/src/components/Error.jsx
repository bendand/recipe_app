export default function Error({ title, message, onConfirm }) {
    return (
        <div>
            <h2>{title}</h2>
            <p>{message}</p>
            {onConfirm && (
                <div>
                    <button onClick={onConfirm}>
                        Okay
                    </button>
                </div>
            )}
        </div>
    );
}