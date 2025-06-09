import { Node, Edge } from 'reactflow'; // Position removed as it's set by layout

export interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  layoutDirection: 'TB' | 'LR';
}

const defaultBgColor = '#f5f5f5';

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
        position: { x: 0, y: 0 }, // Position will be set by layout
        width: 180,
        height: 60,
      },
      {
        id: 'slf-action1',
        type: 'action',
        data: { id: 'slf-action1', label: 'Perform Task', backgroundColor: defaultBgColor },
        position: { x: 0, y: 0 },
        width: 180,
        height: 60,
      },
      {
        id: 'slf-end',
        type: 'end',
        data: { id: 'slf-end', label: 'End Process', backgroundColor: defaultBgColor },
        position: { x: 0, y: 0 },
        width: 180,
        height: 60,
      },
    ],
    edges: [
      { id: 'slf-e1-2', source: 'slf-start', target: 'slf-action1', animated: false },
      { id: 'slf-e2-3', source: 'slf-action1', target: 'slf-end', animated: false },
    ],
  },
  {
    name: 'IT User Onboarding',
    description: 'Workflow for onboarding a new IT user, including resource allocation and approvals.',
    layoutDirection: 'TB',
    nodes: [
      { id: 'itu-start', type: 'start', data: { id: 'itu-start', label: 'New User Request', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'itu-action-hr', type: 'action', data: { id: 'itu-action-hr', label: 'HR Verification', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'itu-cond-hr', type: 'condition', data: { id: 'itu-cond-hr', label: 'HR Approved?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'itu-action-it-setup', type: 'action', data: { id: 'itu-action-it-setup', label: 'IT Account Setup', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'itu-action-resource', type: 'action', data: { id: 'itu-action-resource', label: 'Allocate Resources (Laptop, Software)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 220, height: 80 },
      { id: 'itu-action-notify', type: 'action', data: { id: 'itu-action-notify', label: 'Notify User & Manager', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'itu-end-complete', type: 'end', data: { id: 'itu-end-complete', label: 'Onboarding Complete', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'itu-action-reject', type: 'action', data: { id: 'itu-action-reject', label: 'Notify Rejection', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'itu-end-rejected', type: 'end', data: { id: 'itu-end-rejected', label: 'Onboarding Rejected', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
    ],
    edges: [
      { id: 'itu-e-start-hr', source: 'itu-start', target: 'itu-action-hr', animated: false },
      { id: 'itu-e-hr-cond', source: 'itu-action-hr', target: 'itu-cond-hr', animated: false },
      { id: 'itu-e-cond-setup', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-right-true', target: 'itu-action-it-setup', label: 'Yes', animated: false },
      { id: 'itu-e-setup-resource', source: 'itu-action-it-setup', target: 'itu-action-resource', animated: false },
      { id: 'itu-e-resource-notify', source: 'itu-action-resource', target: 'itu-action-notify', animated: false },
      { id: 'itu-e-notify-complete', source: 'itu-action-notify', target: 'itu-end-complete', animated: false },
      { id: 'itu-e-cond-reject', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-bottom-false', target: 'itu-action-reject', label: 'No', animated: false },
      { id: 'itu-e-reject-rejected', source: 'itu-action-reject', target: 'itu-end-rejected', animated: false },
    ],
  },
  {
    name: 'Bank Loan Approval',
    description: 'Process for approving a bank loan, with credit checks and risk assessment.',
    layoutDirection: 'LR',
    nodes: [
      { id: 'bla-start', type: 'start', data: { id: 'bla-start', label: 'Loan Application Received', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 200, height: 60 },
      { id: 'bla-action-docs', type: 'action', data: { id: 'bla-action-docs', label: 'Document Verification', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'bla-cond-docs', type: 'condition', data: { id: 'bla-cond-docs', label: 'Docs OK?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'bla-action-credit', type: 'action', data: { id: 'bla-action-credit', label: 'Credit Check', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'bla-cond-credit', type: 'condition', data: { id: 'bla-cond-credit', label: 'Credit Score > 700?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 200, height: 80 },
      { id: 'bla-action-risk', type: 'action', data: { id: 'bla-action-risk', label: 'Risk Assessment', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'bla-cond-risk', type: 'condition', data: { id: 'bla-cond-risk', label: 'Risk Low?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'bla-action-approve', type: 'action', data: { id: 'bla-action-approve', label: 'Approve Loan & Disburse', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 200, height: 70 },
      { id: 'bla-end-approved', type: 'end', data: { id: 'bla-end-approved', label: 'Loan Approved', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'bla-action-reject', type: 'action', data: { id: 'bla-action-reject', label: 'Reject Application', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'bla-end-rejected', type: 'end', data: { id: 'bla-end-rejected', label: 'Loan Rejected', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
    ],
    edges: [
      { id: 'bla-e-start-docs', source: 'bla-start', target: 'bla-action-docs', animated: false },
      { id: 'bla-e-docs-cond', source: 'bla-action-docs', target: 'bla-cond-docs', animated: false },
      { id: 'bla-e-conddocs-credit', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-right-true', target: 'bla-action-credit', label: 'Yes', animated: false },
      { id: 'bla-e-conddocs-reject', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-bottom-false', target: 'bla-action-reject', label: 'No', animated: false },
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
    description: 'Simplified workflow for a share market buy order execution.',
    layoutDirection: 'TB',
    nodes: [
      { id: 'smt-start', type: 'start', data: { id: 'smt-start', label: 'User Places Buy Order', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 200, height: 60 },
      { id: 'smt-action-validate', type: 'action', data: { id: 'smt-action-validate', label: 'Validate Order (Funds, Stock Availability)', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 240, height: 80 },
      { id: 'smt-cond-valid', type: 'condition', data: { id: 'smt-cond-valid', label: 'Order Valid?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'smt-action-exchange', type: 'action', data: { id: 'smt-action-exchange', label: 'Send to Exchange', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 70 },
      { id: 'smt-cond-executed', type: 'condition', data: { id: 'smt-cond-executed', label: 'Order Executed?', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 80 },
      { id: 'smt-action-confirm', type: 'action', data: { id: 'smt-action-confirm', label: 'Confirm Execution to User', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 200, height: 70 },
      { id: 'smt-end-success', type: 'end', data: { id: 'smt-end-success', label: 'Trade Successful', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
      { id: 'smt-action-failed', type: 'action', data: { id: 'smt-action-failed', label: 'Notify Order Failure/Rejection', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 220, height: 70 },
      { id: 'smt-end-failed', type: 'end', data: { id: 'smt-end-failed', label: 'Trade Failed', backgroundColor: defaultBgColor }, position: { x: 0, y: 0 }, width: 180, height: 60 },
    ],
    edges: [
      { id: 'smt-e-start-validate', source: 'smt-start', target: 'smt-action-validate', animated: false },
      { id: 'smt-e-validate-cond', source: 'smt-action-validate', target: 'smt-cond-valid', animated: false },
      { id: 'smt-e-condvalid-exchange', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-right-true', target: 'smt-action-exchange', label: 'Yes', animated: false },
      { id: 'smt-e-condvalid-failed', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-bottom-false', target: 'smt-action-failed', label: 'No', animated: false },
      { id: 'smt-e-exchange-condexe', source: 'smt-action-exchange', target: 'smt-cond-executed', animated: false },
      { id: 'smt-e-condexe-confirm', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-right-true', target: 'smt-action-confirm', label: 'Yes', animated: false },
      { id: 'smt-e-condexe-failed', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-bottom-false', target: 'smt-action-failed', label: 'No', animated: false },
      { id: 'smt-e-confirm-success', source: 'smt-action-confirm', target: 'smt-end-success', animated: false },
      { id: 'smt-e-failed-end', source: 'smt-action-failed', target: 'smt-end-failed', animated: false },
    ],
  },
];
