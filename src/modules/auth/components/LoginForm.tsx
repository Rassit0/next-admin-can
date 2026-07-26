"use client";

import React, { useActionState, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Label,
  InputGroup,
  Checkbox,
  Link,
  Alert,
} from "@heroui/react";
import { motion, Variants } from "framer-motion";
import {
  MailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  AlertCircleIcon,
  SpinnerIcon,
} from "./icons";
import { useSearchParams } from "next/navigation";
import { authenticate } from "@/modules/auth";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirectTo") || "/";
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  const [rememberMe, setRememberMe] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="w-full bg-surface/40 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[2rem] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Glow effects inside the card */}
      <div className="absolute top-[-50%] left-[-50%] w-full h-full bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        variants={itemVariants}
        className="mb-6 sm:mb-8 text-center relative z-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
          Bienvenido de nuevo
        </h2>
        <p className="text-muted text-sm sm:text-base">
          Ingresa tus credenciales para acceder.
        </p>
      </motion.div>

      <form
        action={formAction}
        className="space-y-5 sm:space-y-6 relative z-10"
      >
        <motion.div variants={itemVariants}>
          <TextField
            isRequired
            className="w-full flex flex-col gap-1.5"
            name="email"
            type="email"
            defaultValue="admin@can.edu.bo"
          >
            <Label className="text-foreground font-semibold text-sm">
              Correo electrónico
            </Label>
            <InputGroup className="bg-surface-secondary/50 backdrop-blur-md border-white/10 hover:border-accent focus-within:border-accent! focus-within:ring-accent/20! transition-colors shadow-inner rounded-xl">
              <InputGroup.Prefix>
                <div className="px-3 text-muted">
                  <MailIcon className="w-5 h-5" />
                </div>
              </InputGroup.Prefix>
              <InputGroup.Input
                type="email"
                autoFocus
                className="w-full py-3 sm:py-3.5 px-0 bg-transparent border-none focus:ring-0 focus:outline-none text-base"
                placeholder="admin@club.com"
                aria-label="Correo electrónico"
              />
            </InputGroup>
          </TextField>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextField
            isRequired
            className="w-full flex flex-col gap-1.5"
            name="password"
            type={isVisible ? "text" : "password"}
          >
            <Label className="text-foreground font-semibold text-sm">
              Contraseña
            </Label>
            <InputGroup className="bg-surface-secondary/50 backdrop-blur-md border-white/10 hover:border-accent focus-within:border-accent! focus-within:ring-accent/20! transition-colors shadow-inner rounded-xl">
              <InputGroup.Prefix>
                <div className="px-3 text-muted">
                  <LockIcon className="w-5 h-5" />
                </div>
              </InputGroup.Prefix>
              <InputGroup.Input
                type={isVisible ? "text" : "password"}
                className="w-full py-3 sm:py-3.5 px-0 bg-transparent border-none focus:ring-0 focus:outline-none text-base tracking-wide"
                placeholder="••••••••"
                aria-label="Contraseña"
              />
              <InputGroup.Suffix>
                <button
                  className="px-3 h-full focus:outline-none flex items-center justify-center hover:bg-default-200/50 transition-colors rounded-r-xl"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={
                    isVisible ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {isVisible ? (
                    <EyeOffIcon className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-muted hover:text-foreground transition-colors" />
                  )}
                </button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>
        </motion.div>

        {/* <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 mt-1">
          <Checkbox 
            size="sm"
            color="primary"
            isSelected={rememberMe}
            onValueChange={setRememberMe}
            classNames={{
              label: "text-sm text-muted font-medium hover:text-foreground transition-colors"
            }}
          >
            Recordarme
          </Checkbox>
          <Link 
            href="/admin/login/forgot" 
            size="sm"
            color="primary"
            className="text-sm font-semibold hover:text-accent transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </motion.div> */}

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 16 }}
            className="overflow-hidden"
          >
            <Alert status="danger">
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>Error de autenticación</Alert.Title>
                <Alert.Description>{errorMessage}</Alert.Description>
              </Alert.Content>
            </Alert>
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="pt-2 sm:pt-4">
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button
            type="submit"
            isDisabled={isPending}
            className="w-full bg-linear-to-r from-accent to-accent-foreground text-white font-bold text-base py-6 sm:py-6 rounded-xl shadow-lg shadow-accent/20 hover:shadow-accent/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
          >
            {isPending && <SpinnerIcon />}
            {isPending ? "Autenticando..." : "Entrar al sistema"}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};
