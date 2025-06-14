export const Dash = () => {
    return (
        <>
            <p>Bem vindo a área de visualização dos dados</p>
            <iframe
                src="http://127.0.0.1:8050/"
                title="Dashboard Python"
                width="100%"
                height="100%"
               style={{ width: "100%", height: 600, border: "1px solid #ccc", borderRadius: 8 }}
                allow="fullscreen"
            />
        </>
    );
};
