import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { WorkspaceLayout } from './layout/WorkspaceLayout';
import { getOpenAIStatus } from '../services/apiClient';
import { clearWorkspace, loadWorkspace, saveWorkspace } from '../services/storageService';
import { CompanyResearchPage } from '../pages/CompanyResearchPage';
import { CoverageCheckPage } from '../pages/CoverageCheckPage';
import { FieldworkPackagePage } from '../pages/FieldworkPackagePage';
import { InterviewGuidePage } from '../pages/InterviewGuidePage';
import { InterviewMaterialImportPage } from '../pages/InterviewMaterialImportPage';
import { InterviewStructuringPage } from '../pages/InterviewStructuringPage';
import { OpportunityMapPage } from '../pages/OpportunityMapPage';
import { OrgStructurePage } from '../pages/OrgStructurePage';
import { PainPointDiagnosisPage } from '../pages/PainPointDiagnosisPage';
import { ProjectSetupPage } from '../pages/ProjectSetupPage';
import { QuestionnaireImportPage } from '../pages/QuestionnaireImportPage';
import { ReportDraftPage } from '../pages/ReportDraftPage';
import { ScenarioGenerationPage } from '../pages/ScenarioGenerationPage';
import { createEmptyWorkspaceState, type WorkspaceState } from '../types/workspace';

export function App() {
  const [state, setState] = useState<WorkspaceState>(createEmptyWorkspaceState());
  const [ready, setReady] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);

  useEffect(() => {
    void loadWorkspace().then((saved) => {
      setState(saved);
      setReady(true);
    });
    void getOpenAIStatus().then((status) => setApiConfigured(status.configured));
  }, []);

  useEffect(() => {
    if (ready) void saveWorkspace(state);
  }, [ready, state]);

  const updateState = (next: Partial<WorkspaceState>) => {
    setState((current) => ({ ...current, ...next, updatedAt: new Date().toISOString() }));
  };

  const resetState = async () => {
    await clearWorkspace();
    setState(createEmptyWorkspaceState());
  };

  if (!ready) {
    return <div className="p-6 text-sm text-muted">正在加载工作台...</div>;
  }

  return (
    <WorkspaceLayout project={state.project} apiConfigured={apiConfigured}>
      <Routes>
        <Route
          path="/"
          element={<ProjectSetupPage state={state} updateState={updateState} resetState={resetState} />}
        />
        <Route path="/company-research" element={<CompanyResearchPage state={state} updateState={updateState} />} />
        <Route path="/org-structure" element={<OrgStructurePage state={state} updateState={updateState} />} />
        <Route path="/questionnaire" element={<QuestionnaireImportPage state={state} updateState={updateState} />} />
        <Route path="/interview-guide" element={<InterviewGuidePage state={state} updateState={updateState} />} />
        <Route path="/fieldwork-package" element={<FieldworkPackagePage state={state} updateState={updateState} />} />
        <Route path="/materials" element={<InterviewMaterialImportPage state={state} updateState={updateState} />} />
        <Route path="/structuring" element={<InterviewStructuringPage state={state} updateState={updateState} />} />
        <Route path="/coverage" element={<CoverageCheckPage state={state} updateState={updateState} />} />
        <Route path="/pain-points" element={<PainPointDiagnosisPage state={state} updateState={updateState} />} />
        <Route path="/scenarios" element={<ScenarioGenerationPage state={state} updateState={updateState} />} />
        <Route path="/opportunity-map" element={<OpportunityMapPage state={state} updateState={updateState} />} />
        <Route path="/report" element={<ReportDraftPage state={state} updateState={updateState} />} />
      </Routes>
    </WorkspaceLayout>
  );
}
