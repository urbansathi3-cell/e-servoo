function AnimatedAuthButton({
  text = "Sign in",
  loading = false,
  type = "submit",
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading}
      className="es-animated-auth-btn es-no-liquid"
    >
      <span className="es-auth-btn-text">
        {loading ? "Please wait..." : text}
      </span>

      <span className="es-auth-runner">
        <span className="es-auth-head"></span>
        <span className="es-auth-body"></span>
        <span className="es-auth-leg es-auth-leg-left"></span>
        <span className="es-auth-leg es-auth-leg-right"></span>
        <span className="es-auth-arm es-auth-arm-left"></span>
        <span className="es-auth-arm es-auth-arm-right"></span>
      </span>

      <span className="es-auth-door">
        <span className="es-auth-door-light"></span>
      </span>
    </button>
  );
}

export default AnimatedAuthButton;