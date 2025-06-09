import { Node, Edge } from 'reactflow';

export interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  layoutDirection: 'TB' | 'LR';
}

const defaultBgColor = '#f5f5f5';
const defaultWidth = 180;
const defaultHeight = 70; // Slightly increased default height for better label visibility
const conditionHeight = 80;
const wideWidth = 220;


export const workflowExamples: WorkflowExample[] = [
  {
    name: 'Simple Linear Flow',
    description: 'A basic sequence: Start -> Action -> End.',
    layoutDirection: 'TB',
    nodes: [
      {
        id: 'slf-start',
        type: 'start',
        data: { id: 'slf-start', label: 'Start Process', backgroundColor: defaultBgColor },
        position: { x: 0, y: 0 },
        width: defaultWidth,
        height: 60,
      },
      {
        id: 'slf-action1',
        type: 'action',
        data: { id: 'slf-action1', label: 'Perform Task', backgroundColor: defaultBgColor },
        position: { x: 0, y: 0 },
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'slf-end',
        type: 'end',
        data: { id: 'slf-end', label: 'End Process', backgroundColor: defaultBgColor },
        position: { x: 0, y: 0 },
        width: defaultWidth,
        height: 60,
      },
    ],
    edges: [
      { id: 'slf-e-start-action1', source: 'slf-start', target: 'slf-action1', animated: false },
      { id: 'slf-e-action1-end', source: 'slf-action1', target: 'slf-end', animated: false },
    ],
  },
  {
    name: 'IT User Onboarding',
    description: 'Workflow for onboarding a new IT user, with IT setup verification.',
    layoutDirection: 'TB',
    nodes: [
      { id: 'itu-start', type: 'start', data: { id: 'itu-start', label: 'New User Request', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
      { id: 'itu-action-hr', type: 'action', data: { id: 'itu-action-hr', label: 'HR Verification', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-cond-hr', type: 'condition', data: { id: 'itu-cond-hr', label: 'HR Approved?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'itu-action-it-setup', type: 'action', data: { id: 'itu-action-it-setup', label: 'Attempt IT Account Setup', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-cond-it-setup-ok', type: 'condition', data: { id: 'itu-cond-it-setup-ok', label: 'IT Setup Successful?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'itu-action-resource', type: 'action', data: { id: 'itu-action-resource', label: 'Allocate Resources', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-action-notify', type: 'action', data: { id: 'itu-action-notify', label: 'Notify User & Manager', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-complete', type: 'end', data: { id: 'itu-end-complete', label: 'Onboarding Complete', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
      { id: 'itu-action-log-issue', type: 'action', data: { id: 'itu-action-log-issue', label: 'Log IT Issue / Escalate', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-end-delayed', type: 'end', data: { id: 'itu-end-delayed', label: 'Onboarding Delayed/Issue', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'itu-action-reject-hr', type: 'action', data: { id: 'itu-action-reject-hr', label: 'Notify HR Rejection', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-rejected-hr', type: 'end', data: { id: 'itu-end-rejected-hr', label: 'Onboarding Rejected (HR)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
    ],
    edges: [
      { id: 'itu-e-start-hr', source: 'itu-start', target: 'itu-action-hr', animated: false },
      { id: 'itu-e-hr-cond', source: 'itu-action-hr', target: 'itu-cond-hr', animated: false },
      { id: 'itu-e-condhr-setup', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-right-true', target: 'itu-action-it-setup', label: 'Yes', animated: false },
      { id: 'itu-e-condhr-reject', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-bottom-false', target: 'itu-action-reject-hr', label: 'No', animated: false },
      { id: 'itu-e-rejecthr-end', source: 'itu-action-reject-hr', target: 'itu-end-rejected-hr', animated: false },
      { id: 'itu-e-setup-condit', source: 'itu-action-it-setup', target: 'itu-cond-it-setup-ok', animated: false },
      { id: 'itu-e-condit-resource', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-right-true', target: 'itu-action-resource', label: 'Yes', animated: false },
      { id: 'itu-e-resource-notify', source: 'itu-action-resource', target: 'itu-action-notify', animated: false },
      { id: 'itu-e-notify-complete', source: 'itu-action-notify', target: 'itu-end-complete', animated: false },
      { id: 'itu-e-condit-logissue', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-bottom-false', target: 'itu-action-log-issue', label: 'No', animated: false },
      { id: 'itu-e-logissue-delayed', source: 'itu-action-log-issue', target: 'itu-end-delayed', animated: false },
    ],
  },
  {
    name: 'Bank Loan Approval',
    description: 'Process for approving a bank loan, with document clarification path.',
    layoutDirection: 'LR',
    nodes: [
      { id: 'bla-start', type: 'start', data: { id: 'bla-start', label: 'Loan Application Received', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'bla-action-docs', type: 'action', data: { id: 'bla-action-docs', label: 'Document Verification', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-docs', type: 'condition', data: { id: 'bla-cond-docs', label: 'Docs OK?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'bla-action-request-info', type: 'action', data: { id: 'bla-action-request-info', label: 'Request Add. Info', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-incomplete', type: 'end', data: { id: 'bla-end-incomplete', label: 'App. Incomplete', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
      { id: 'bla-action-credit', type: 'action', data: { id: 'bla-action-credit', label: 'Credit Check', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-credit', type: 'condition', data: { id: 'bla-cond-credit', label: 'Credit Score OK?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'bla-action-risk', type: 'action', data: { id: 'bla-action-risk', label: 'Risk Assessment', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-risk', type: 'condition', data: { id: 'bla-cond-risk', label: 'Risk Low?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'bla-action-approve', type: 'action', data: { id: 'bla-action-approve', label: 'Approve Loan & Disburse', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'bla-end-approved', type: 'end', data: { id: 'bla-end-approved', label: 'Loan Approved', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
      { id: 'bla-action-reject', type: 'action', data: { id: 'bla-action-reject', label: 'Notify Rejection', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-rejected', type: 'end', data: { id: 'bla-end-rejected', label: 'Loan Rejected', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'bla-e-start-docs', source: 'bla-start', target: 'bla-action-docs', animated: false },
      { id: 'bla-e-docs-cond', source: 'bla-action-docs', target: 'bla-cond-docs', animated: false },
      { id: 'bla-e-conddocs-credit', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-right-true', target: 'bla-action-credit', label: 'Yes', animated: false },
      { id: 'bla-e-conddocs-reqinfo', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-bottom-false', target: 'bla-action-request-info', label: 'No', animated: false },
      { id: 'bla-e-reqinfo-endinc', source: 'bla-action-request-info', target: 'bla-end-incomplete', animated: false },
      { id: 'bla-e-credit-cond', source: 'bla-action-credit', target: 'bla-cond-credit', animated: false },
      { id: 'bla-e-condcred-risk', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-right-true', target: 'bla-action-risk', label: 'Yes', animated: false },
      { id: 'bla-e-condcred-reject', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-bottom-false', target: 'bla-action-reject', label: 'No', animated: false },
      { id: 'bla-e-risk-cond', source: 'bla-action-risk', target: 'bla-cond-risk', animated: false },
      { id: 'bla-e-condrisk-approve', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-right-true', target: 'bla-action-approve', label: 'Yes', animated: false },
      { id: 'bla-e-condrisk-reject', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-bottom-false', target: 'bla-action-reject', label: 'No', animated: false },
      { id: 'bla-e-approve-end', source: 'bla-action-approve', target: 'bla-end-approved', animated: false },
      { id: 'bla-e-reject-end', source: 'bla-action-reject', target: 'bla-end-rejected', animated: false },
    ],
  },
  {
    name: 'Share Market Trading',
    description: 'Workflow for a share market buy order, with partial fill handling.',
    layoutDirection: 'TB',
    nodes: [
      { id: 'smt-start', type: 'start', data: { id: 'smt-start', label: 'User Places Buy Order', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'smt-action-validate', type: 'action', data: { id: 'smt-action-validate', label: 'Validate Order (Funds, Stock)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-cond-valid', type: 'condition', data: { id: 'smt-cond-valid', label: 'Order Valid?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'smt-action-exchange', type: 'action', data: { id: 'smt-action-exchange', label: 'Send to Exchange', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-cond-executed', type: 'condition', data: { id: 'smt-cond-executed', label: 'Order Fully Executed?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'smt-action-confirm-full', type: 'action', data: { id: 'smt-action-confirm-full', label: 'Confirm Full Execution', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-end-success', type: 'end', data: { id: 'smt-end-success', label: 'Trade Successful (Full)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'smt-cond-partial-fill', type: 'condition', data: { id: 'smt-cond-partial-fill', label: 'Partially Filled?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: conditionHeight },
      { id: 'smt-action-notify-partial', type: 'action', data: { id: 'smt-action-notify-partial', label: 'Notify Partial Fill & Update', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-end-partial', type: 'end', data: { id: 'smt-end-partial', label: 'Order Partially Completed', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'smt-action-failed-exchange', type: 'action', data: { id: 'smt-action-failed-exchange', label: 'Notify Order Failure (Exchange)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-end-failed-exchange', type: 'end', data: { id: 'smt-end-failed-exchange', label: 'Trade Failed (Exchange)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: wideWidth, height: 60 },
      { id: 'smt-action-failed-validation', type: 'action', data: { id: 'smt-action-failed-validation', label: 'Notify Order Invalid', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-end-failed-validation', type: 'end', data: { id: 'smt-end-failed-validation', label: 'Trade Invalid', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'smt-e-start-validate', source: 'smt-start', target: 'smt-action-validate', animated: false },
      { id: 'smt-e-validate-cond', source: 'smt-action-validate', target: 'smt-cond-valid', animated: false },
      { id: 'smt-e-condvalid-exchange', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-right-true', target: 'smt-action-exchange', label: 'Yes', animated: false },
      { id: 'smt-e-condvalid-failval', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-bottom-false', target: 'smt-action-failed-validation', label: 'No', animated: false },
      { id: 'smt-e-failval-end', source: 'smt-action-failed-validation', target: 'smt-end-failed-validation', animated: false },
      { id: 'smt-e-exchange-condexe', source: 'smt-action-exchange', target: 'smt-cond-executed', animated: false },
      { id: 'smt-e-condexe-confirmfull', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-right-true', target: 'smt-action-confirm-full', label: 'Yes (Full)', animated: false },
      { id: 'smt-e-confirmfull-endsuccess', source: 'smt-action-confirm-full', target: 'smt-end-success', animated: false },
      { id: 'smt-e-condexe-condpartial', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-bottom-false', target: 'smt-cond-partial-fill', label: 'No (Not Full)', animated: false },
      { id: 'smt-e-condpartial-notifypartial', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-right-true', target: 'smt-action-notify-partial', label: 'Yes (Partial)', animated: false },
      { id: 'smt-e-notifypartial-endpartial', source: 'smt-action-notify-partial', target: 'smt-end-partial', animated: false },
      { id: 'smt-e-condpartial-failexchange', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-bottom-false', target: 'smt-action-failed-exchange', label: 'No (Complete Fail)', animated: false },
      { id: 'smt-e-failexchange-end', source: 'smt-action-failed-exchange', target: 'smt-end-failed-exchange', animated: false },
    ],
  },
];
