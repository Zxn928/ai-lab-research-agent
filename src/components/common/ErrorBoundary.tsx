import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error?: Error }
> {
  state: { error?: Error } = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(error);
  }

  componentDidMount() {
    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private handleWindowError = (event: ErrorEvent) => {
    this.setState({ error: event.error instanceof Error ? event.error : new Error(event.message) });
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    event.preventDefault();
    const reason = event.reason;
    this.setState({ error: reason instanceof Error ? reason : new Error(String(reason || '未知异步错误')) });
  };

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-bg px-6">
        <div className="w-full max-w-xl rounded-lg border border-red-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-red-600" />
            <div>
              <h1 className="text-lg font-semibold text-ink">页面渲染失败</h1>
              <p className="mt-2 text-sm leading-6 text-muted">
                系统捕获到一个前端异常，没有继续白屏。可以先刷新页面；如果刚刚上传了文件，请把文件另存为 .xlsx 或 CSV 后再试。
              </p>
              <pre className="mt-4 max-h-40 overflow-auto rounded-md bg-red-50 p-3 text-xs leading-5 text-red-700">
                {this.state.error.message}
              </pre>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                <RotateCcw className="h-4 w-4" />
                刷新页面
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
