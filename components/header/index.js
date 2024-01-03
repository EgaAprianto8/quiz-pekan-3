import { withAuth } from "../with-auth";  
import Menu from "../menu";

function Header() {
  return (
  <div className="bg-blue-400 w-full text-xl">
    <Menu/>
  </div>
  );
}

export default withAuth(Header);