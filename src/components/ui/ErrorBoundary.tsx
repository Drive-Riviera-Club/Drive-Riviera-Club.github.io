import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto mt-20 max-w-lg rounded-2xl border border-rose-200 bg-white p-6 text-center">
          <h2 className="font-heading text-3xl text-navy">Algo salio mal</h2>
          <p className="mt-3 text-sm text-slate-600">Recarga la pagina para continuar tu solicitud.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
