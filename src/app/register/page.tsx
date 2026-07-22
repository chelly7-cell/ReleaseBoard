"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";

import {
  RegisterSchema,
  RegisterFormValues,
} from "@/lib/validations/register";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


export default function RegisterPage() {

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);


  const {
    register,
    handleSubmit,
    formState:{ errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver:zodResolver(RegisterSchema),
  });



  const onSubmit = async(data:RegisterFormValues)=>{

    try{

      setLoading(true);


      const {error}=await authClient.signUp.email({

        name:data.name,

        email:data.email,

        password:data.password,

      });



      if(error){

        throw new Error(error.message);

      }



      toast.success("Account created 🎉");


      reset();


      router.push("/dashboard");


    }catch(err:any){

      toast.error(
        err.message || "Something went wrong"
      );


    }finally{

      setLoading(false);

    }

  };




  const handleGithubRegister=async()=>{

    try{

      setGithubLoading(true);


      await authClient.signIn.social({

        provider:"github",

        callbackURL:"/dashboard",

      });


    }catch(err){

      console.error(err);

      toast.error(
        "GitHub login failed"
      );


    }finally{

      setGithubLoading(false);

    }

  };





  return (

    <main className="relative min-h-screen overflow-hidden bg-background">


      {/* BACKGROUND */}

      <div className="absolute inset-0 -z-10">


        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[140px]" />


        <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[130px]" />


      </div>





      <div className="flex min-h-screen items-center justify-center px-6 py-12">


        <div className="w-full max-w-md">


          {/* LOGO */}

          <div className="mb-8 flex flex-col items-center">


            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 shadow-xl shadow-blue-600/30">


              <Sparkles className="h-7 w-7 text-white"/>


            </div>



            <h1 className="mt-5 text-3xl font-black tracking-tight">

              Create your account

            </h1>


            <p className="mt-2 text-center text-muted-foreground">

              Start building beautiful release pages

            </p>


          </div>





          {/* CARD */}

          <div className="rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur-xl">



            <Badge className="mb-6 bg-blue-500/10 text-blue-500">

              🚀 Developer platform

            </Badge>





            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >



              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-medium">

                  Full name

                </label>


                <Input

                  placeholder="John Doe"

                  className="h-12 rounded-xl"

                  {...register("name")}

                />


                {
                  errors.name &&

                  <p className="mt-2 text-sm text-red-500">

                    {errors.name.message}

                  </p>

                }


              </div>






              {/* EMAIL */}

              <div>


                <label className="mb-2 block text-sm font-medium">

                  Email address

                </label>



                <Input

                  placeholder="you@example.com"

                  className="h-12 rounded-xl"

                  {...register("email")}

                />



                {
                  errors.email &&

                  <p className="mt-2 text-sm text-red-500">

                    {errors.email.message}

                  </p>

                }


              </div>







              {/* PASSWORD */}

              <div>


                <label className="mb-2 block text-sm font-medium">

                  Password

                </label>



                <Input

                  type="password"

                  placeholder="••••••••"

                  className="h-12 rounded-xl"

                  {...register("password")}

                />



                {
                  errors.password &&

                  <p className="mt-2 text-sm text-red-500">

                    {errors.password.message}

                  </p>

                }


              </div>







              {/* REGISTER BUTTON */}


              <Button

                disabled={loading}

                className="h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-base shadow-lg shadow-blue-600/30 transition hover:scale-[1.02]"

              >

                {
                  loading
                  ?
                  "Creating account..."
                  :
                  <>

                  Create Account

                  <ArrowRight className="ml-2 h-4 w-4"/>

                  </>
                }


              </Button>






              {/* DIVIDER */}


              <div className="flex items-center gap-3 py-2">


                <div className="h-px flex-1 bg-border"/>


                <span className="text-xs text-muted-foreground">

                  OR

                </span>


                <div className="h-px flex-1 bg-border"/>


              </div>






              {/* GITHUB */}


              <Button

                type="button"

                variant="outline"

                className="h-12 w-full rounded-xl"

                onClick={handleGithubRegister}

                disabled={githubLoading}

              >


                <FaGithub className="mr-2 h-5 w-5"/>


                {
                  githubLoading
                  ?
                  "Connecting..."
                  :
                  "Continue with GitHub"
                }


              </Button>






              <p className="pt-3 text-center text-sm text-muted-foreground">


                Already have an account?


                <Link

                  href="/login"

                  className="ml-1 font-medium text-blue-500 hover:underline"

                >

                  Sign in

                </Link>


              </p>



            </form>


          </div>





          <p className="mt-8 text-center text-xs text-muted-foreground">

            By creating an account, you agree to our Terms and Privacy Policy.

          </p>



        </div>


      </div>


    </main>

  );
}