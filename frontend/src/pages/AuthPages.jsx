import { SignIn, SignUp } from "@clerk/react";
import { Logo } from "@/components/site/Navbar";

const Shell = ({ children }) => (
  <div className="relative flex min-h-screen bg-[#05070E]">
    <div className="relative hidden flex-1 overflow-hidden lg:flex">
      <img src="/images/img2.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#05070E]/40 to-[#05070E]" />
      <div className="relative flex flex-col justify-between p-12">
        <Logo />
        <div>
          <p className="eyebrow">Admin console</p>
          <h1 className="mt-3 text-5xl font-black text-white">Manage the verse.</h1>
          <p className="mt-3 max-w-md text-slate-400">Restricted to approved DataVerse 2K27 organisers.</p>
        </div>
      </div>
    </div>
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-12">
      <div className="lg:hidden"><Logo /></div>
      {children}
    </div>
  </div>
);

export const SignInPage = () => (
  <Shell><div data-testid="sign-in-page"><SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" withSignUp /></div></Shell>
);

export const SignUpPage = () => (
  <Shell><div data-testid="sign-up-page"><SignUp routing="path" path="/sign-up" signInUrl="/sign-in" /></div></Shell>
);
