import { useRouter } from "next/router";
import Login from "@/pages/client/login"

const withAuth = Component => {
    const Auth = (props) => {
    const router = useRouter()
      if (typeof window !== "undefined" &&  !localStorage.getItem("userToken")) {
          router.push("/client/login")
            return (
                <Login />
            );
      }
      else {
          return (
            <Component {...props} />
          );
      }
    };
  
    // Copy getInitial props so it will run as well
    if (Component.getInitialProps) {
      Auth.getInitialProps = Component.getInitialProps;
    }
  
    return Auth;
  };
  
  export default withAuth;