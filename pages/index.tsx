import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";

export default function Home() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  const handleLogin = async (email) => {
    try {
      const { error } = await supabaseClient.auth.signInWithOtp({ email });
      if (error) {
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  useEffect(() => {
    async function loadData() {
      const { data } = await supabaseClient.from("test").select("*");
      setData(data as any);
    }
    // Only run query once user is logged in.
    if (user) loadData();
  }, [user]);

  if (!user) {
    return (
      <main>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleLogin(email);
          }}
        >
          Send magic link
        </button>
        {status === "success" ? (
          <p>Check your email for the login link!</p>
        ) : status === "error" ? (
          <p>Check your email for the login link!</p>
        ) : (
          status === "idle" && null
        )}
      </main>
    );
  }

  return (
    <>
      <button onClick={() => supabaseClient.auth.signOut()}>Sign out</button>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <p>client-side data fetching with RLS</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}
