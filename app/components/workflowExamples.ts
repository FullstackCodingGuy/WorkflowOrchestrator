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
      { id: 'slf-e-start-action1', type: 'dotFlow', source: 'slf-start', target: 'slf-action1', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e', completed: false } },
      { id: 'slf-e-action1-end', type: 'dotFlow', source: 'slf-action1', target: 'slf-end', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e', completed: false } },
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
      { id: 'itu-e-start-hr', type: 'dotFlow', source: 'itu-start', target: 'itu-action-hr', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-hr-cond', type: 'dotFlow', source: 'itu-action-hr', target: 'itu-cond-hr', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-condhr-setup', type: 'dotFlow', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-true', target: 'itu-action-it-setup', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-condhr-reject', type: 'dotFlow', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-false', target: 'itu-action-reject-hr', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-rejecthr-end', type: 'dotFlow', source: 'itu-action-reject-hr', target: 'itu-end-rejected-hr', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-setup-condit', type: 'dotFlow', source: 'itu-action-it-setup', target: 'itu-cond-it-setup-ok', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-condit-resource', type: 'dotFlow', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-true', target: 'itu-action-resource', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-resource-notify', type: 'dotFlow', source: 'itu-action-resource', target: 'itu-action-notify', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-notify-complete', type: 'dotFlow', source: 'itu-action-notify', target: 'itu-end-complete', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-condit-logissue', type: 'dotFlow', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-false', target: 'itu-action-log-issue', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'itu-e-logissue-delayed', type: 'dotFlow', source: 'itu-action-log-issue', target: 'itu-end-delayed', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
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
      { id: 'bla-e-start-docs', type: 'dotFlow', source: 'bla-start', target: 'bla-action-docs', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-docs-cond', type: 'dotFlow', source: 'bla-action-docs', target: 'bla-cond-docs', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-conddocs-credit', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-true', target: 'bla-action-credit', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-conddocs-reqinfo', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-false', target: 'bla-action-request-info', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-reqinfo-endinc', type: 'dotFlow', source: 'bla-action-request-info', target: 'bla-end-incomplete', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-credit-cond', type: 'dotFlow', source: 'bla-action-credit', target: 'bla-cond-credit', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-condcred-risk', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-true', target: 'bla-action-risk', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-condcred-reject', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-risk-cond', type: 'dotFlow', source: 'bla-action-risk', target: 'bla-cond-risk', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-condrisk-approve', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-true', target: 'bla-action-approve', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-condrisk-reject', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-approve-end', type: 'dotFlow', source: 'bla-action-approve', target: 'bla-end-approved', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'bla-e-reject-end', type: 'dotFlow', source: 'bla-action-reject', target: 'bla-end-rejected', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
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
      { id: 'smt-e-start-validate', type: 'dotFlow', source: 'smt-start', target: 'smt-action-validate', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-validate-cond', type: 'dotFlow', source: 'smt-action-validate', target: 'smt-cond-valid', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condvalid-exchange', type: 'dotFlow', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-true', target: 'smt-action-exchange', label: 'Yes', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condvalid-failval', type: 'dotFlow', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-false', target: 'smt-action-failed-validation', label: 'No', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-failval-end', type: 'dotFlow', source: 'smt-action-failed-validation', target: 'smt-end-failed-validation', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-exchange-condexe', type: 'dotFlow', source: 'smt-action-exchange', target: 'smt-cond-executed', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condexe-confirmfull', type: 'dotFlow', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-true', target: 'smt-action-confirm-full', label: 'Yes (Full)', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-confirmfull-endsuccess', type: 'dotFlow', source: 'smt-action-confirm-full', target: 'smt-end-success', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condexe-condpartial', type: 'dotFlow', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-false', target: 'smt-cond-partial-fill', label: 'No (Not Full)', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condpartial-notifypartial', type: 'dotFlow', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-true', target: 'smt-action-notify-partial', label: 'Yes (Partial)', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-notifypartial-endpartial', type: 'dotFlow', source: 'smt-action-notify-partial', target: 'smt-end-partial', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-condpartial-failexchange', type: 'dotFlow', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-false', target: 'smt-action-failed-exchange', label: 'No (Complete Fail)', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
      { id: 'smt-e-failexchange-end', type: 'dotFlow', source: 'smt-action-failed-exchange', target: 'smt-end-failed-exchange', animated: false, data: { animatedColor: '#6c2bd7', completedColor: '#22c55e' } },
    ],
  },
];
