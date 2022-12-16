import {
  createServerSupabaseClient,
  User,
} from "@supabase/auth-helpers-nextjs";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

export default function dashboard({ user }: { user: User }) {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  function SignOut() {
    supabaseClient.auth.signOut();
    router.push("/");
  }

  return (
    <>
      <p>user:</p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <button onClick={() => SignOut()}>Sign out</button>
    </>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const { data } = await supabase.from("users").select("*");

  return {
    props: {
      initialSession: session,
      user: session.user,
      data: data ?? [],
    },
  };
};
