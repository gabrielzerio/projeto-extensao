import React from "react";  

interface PopupProps {
  onClose: () => void;
  visible: boolean;
  mensagem: string; 
}

const PopupFinal: React.FC<PopupProps> = ({ visible, onClose, mensagem }) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        id="principal"
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "600px",
          height: "300px",
          backgroundColor: "rgb(228, 159, 80)",
          padding: "20px",
        }}
      >
        <p
          style={{
            position: "absolute",
            backgroundColor: "wheat",
            padding: "20px",
            width: "400px",
            height: "180px",
            left: "100px",
            top: "1px",
            borderRadius: "17px",
          }}
        >
          {mensagem}
        </p>
          
        <button
          id="avancar"
          style={{
            position: "absolute",
            bottom: "10px",
            right: "100px",
            width: "100px",
            backgroundColor: "transparent",
            border: "none",
          }}
           onClick={() => window.location.reload()} 
           
        >
            voltar ao menu tutorial
        </button>

        <div
          id="peao"
          style={{
            position: "absolute",
            bottom: "-15px",
            right: "-65px",
            width: "100px",
            height: "130px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <img
            src="/imgs/white-pawn.webp"
            alt="peao"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
};

export default PopupFinal;
