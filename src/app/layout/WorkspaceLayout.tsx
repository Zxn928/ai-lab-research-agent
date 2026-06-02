import type { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import type { Project } from '../../types/project';
import { MobileNavigation } from './MobileNavigation';

export function WorkspaceLayout({
  children,
  project,
  apiConfigured
}: {
  children: ReactNode;
  project?: Project;
  apiConfigured?: boolean;
}) {
  return (
    <div className="flex min-h-dvh bg-slate-100">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header project={project} apiConfigured={apiConfigured} />
        <MobileNavigation />
        <main id="main-content" className="flex-1 p-4 md:p-6 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
