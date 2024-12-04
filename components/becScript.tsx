'use client';
import Script from "next/script";
import { useState , useEffect} from "react";
declare const TE;

export default function BecScript({
}) {
  const [env, setEnv] = useState<string | null>(null);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const envParam = urlParams.get("env") || "prod";
    setEnv(envParam);
  }, []);
   const scriptSrc =
    env === "dev"
      ? "https://tma-demo.dmtp.tech/sdk/0.0.8/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D"
      : "https://bec.dmtp.tech/0.0.8/bec.js?walletAddress=QnLOYksIDhA3MfBLoRL%2ByIa8jRggeovB3NtN3d7LD7g%3D";
  return (
    <>
     <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="beforeInteractive" // Loads the script after the page is interactive
         onLoad={() => {
         console.log("Telegram Web App loaded");
        }}
      />
      {env && <Script
        src={scriptSrc}
        strategy="afterInteractive" // Loads the script after the page is interactive
        onLoad={() => {
          if (typeof TE.onLoad === "function") {
            TE.onLoad();
          } else {
            console.error('TE.onLoad is not a function');
          }
        }}
      />}
    </>
  );
}
