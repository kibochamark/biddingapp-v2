import { Suspense } from "react";
import ClientFooter from "./footer/client_footer";

export default function Footer() {

  return (
      <>
        <Suspense fallback={<div>Loading Footer...</div>}>
            <ClientFooter />
        </Suspense>
        
      </>
  );
}
