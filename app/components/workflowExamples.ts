import { Node, Edge } from 'reactflow';
import { APP_COLORS, NODE_DIMENSIONS } from '../config/appConfig';

export interface WorkflowExample {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  layoutDirection: 'TB' | 'LR';
}

const defaultBgColor = APP_COLORS.defaultBg;
const defaultWidth = NODE_DIMENSIONS.defaultWidth;
const defaultHeight = NODE_DIMENSIONS.defaultHeight;
const conditionHeight = NODE_DIMENSIONS.conditionHeight;
const wideWidth = NODE_DIMENSIONS.wideWidth;

export const workflowExamples: WorkflowExample[] = [
  {
    name: 'E-Commerce Order Processing',
    description: 'A waterfall 5-step order processing workflow: Order Received → Validate Payment → Process Order → Fulfill Order → Order Complete.',
    layoutDirection: 'TB',
    nodes: [
      {
        id: 'eop-start',
        type: 'start',
        data: { 
          id: 'eop-start', 
          label: 'Order Received', 
          backgroundColor: '#dcfce7', // Light green
          nodeType: 'start' 
        },
        position: { x: 50, y: 50 }, // Waterfall start
        width: defaultWidth,
        height: 60,
      },
      {
        id: 'eop-validate',
        type: 'action',
        data: { 
          id: 'eop-validate', 
          label: 'Validate Payment', 
          backgroundColor: '#fef3c7', // Light yellow
          nodeType: 'action' 
        },
        position: { x: 350, y: 200 }, // Step down and right
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-process',
        type: 'process',
        data: { 
          id: 'eop-process', 
          label: 'Process Order Items', 
          backgroundColor: '#dbeafe', // Light blue
          nodeType: 'process' 
        },
        position: { x: 650, y: 350 }, // Step down and right
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-fulfill',
        type: 'action',
        data: { 
          id: 'eop-fulfill', 
          label: 'Package & Ship', 
          backgroundColor: '#f3e8ff', // Light purple
          nodeType: 'action' 
        },
        position: { x: 950, y: 500 }, // Step down and right
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-complete',
        type: 'end',
        data: { 
          id: 'eop-complete', 
          label: 'Order Complete', 
          backgroundColor: '#fce7f3', // Light pink
          nodeType: 'end' 
        },
        position: { x: 1250, y: 650 }, // Final step down and right
        width: defaultWidth,
        height: 60,
      },
    ],
    edges: [
      { 
        id: 'eop-e-start-validate', 
        type: 'dotFlow', 
        source: 'eop-start', 
        target: 'eop-validate', 
        label: 'New Order',
        animated: false, 
        data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } 
      },
      { 
        id: 'eop-e-validate-process', 
        type: 'dotFlow', 
        source: 'eop-validate', 
        target: 'eop-process', 
        label: 'Payment OK',
        animated: false, 
        data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } 
      },
      { 
        id: 'eop-e-process-fulfill', 
        type: 'dotFlow', 
        source: 'eop-process', 
        target: 'eop-fulfill', 
        label: 'Items Ready',
        animated: false, 
        data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } 
      },
      { 
        id: 'eop-e-fulfill-complete', 
        type: 'dotFlow', 
        source: 'eop-fulfill', 
        target: 'eop-complete', 
        label: 'Shipped',
        animated: false, 
        data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } 
      },
    ],
  },
  {
    name: 'IT User Onboarding',
    description: 'Workflow for onboarding a new IT user, with IT setup verification.',
    layoutDirection: 'TB',
    nodes: [
      // Main flow - centered
      { id: 'itu-start', type: 'start', data: { id: 'itu-start', label: 'New User Request', backgroundColor: defaultBgColor, nodeType: 'start' }, position: { x: 400, y: 50 }, width: defaultWidth, height: 60 },
      { id: 'itu-action-hr', type: 'action', data: { id: 'itu-action-hr', label: 'HR Verification', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 150 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-cond-hr', type: 'condition', data: { id: 'itu-cond-hr', label: 'HR Approved?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 400, y: 280 }, width: defaultWidth, height: conditionHeight },
      
      // Success path - center-left
      { id: 'itu-action-it-setup', type: 'action', data: { id: 'itu-action-it-setup', label: 'Attempt IT Account Setup', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 420 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-cond-it-setup-ok', type: 'condition', data: { id: 'itu-cond-it-setup-ok', label: 'IT Setup Successful?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 400, y: 560 }, width: defaultWidth, height: conditionHeight },
      { id: 'itu-action-resource', type: 'action', data: { id: 'itu-action-resource', label: 'Allocate Resources', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 200, y: 700 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-action-notify', type: 'action', data: { id: 'itu-action-notify', label: 'Notify User & Manager', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 200, y: 840 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-complete', type: 'end', data: { id: 'itu-end-complete', label: 'Onboarding Complete', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 200, y: 980 }, width: defaultWidth, height: 60 },
      
      // IT failure path - center-right
      { id: 'itu-action-log-issue', type: 'action', data: { id: 'itu-action-log-issue', label: 'Log IT Issue / Escalate', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 600, y: 700 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-end-delayed', type: 'end', data: { id: 'itu-end-delayed', label: 'Onboarding Delayed/Issue', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 600, y: 840 }, width: wideWidth, height: 60 },
      
      // HR rejection path - right
      { id: 'itu-action-reject-hr', type: 'action', data: { id: 'itu-action-reject-hr', label: 'Notify HR Rejection', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 700, y: 420 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-rejected-hr', type: 'end', data: { id: 'itu-end-rejected-hr', label: 'Onboarding Rejected (HR)', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 700, y: 560 }, width: wideWidth, height: 60 },
    ],
    edges: [
      { id: 'itu-e-start-hr', type: 'dotFlow', source: 'itu-start', target: 'itu-action-hr', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-hr-cond', type: 'dotFlow', source: 'itu-action-hr', target: 'itu-cond-hr', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-condhr-setup', type: 'dotFlow', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-true', target: 'itu-action-it-setup', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-condhr-reject', type: 'dotFlow', source: 'itu-cond-hr', sourceHandle: 'itu-cond-hr-source-false', target: 'itu-action-reject-hr', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-rejecthr-end', type: 'dotFlow', source: 'itu-action-reject-hr', target: 'itu-end-rejected-hr', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-setup-condit', type: 'dotFlow', source: 'itu-action-it-setup', target: 'itu-cond-it-setup-ok', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-condit-resource', type: 'dotFlow', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-true', target: 'itu-action-resource', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-resource-notify', type: 'dotFlow', source: 'itu-action-resource', target: 'itu-action-notify', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-notify-complete', type: 'dotFlow', source: 'itu-action-notify', target: 'itu-end-complete', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-condit-logissue', type: 'dotFlow', source: 'itu-cond-it-setup-ok', sourceHandle: 'itu-cond-it-setup-ok-source-false', target: 'itu-action-log-issue', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'itu-e-logissue-delayed', type: 'dotFlow', source: 'itu-action-log-issue', target: 'itu-end-delayed', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
    ],
  },
  {
    name: 'Bank Loan Approval',
    description: 'Process for approving a bank loan, with document clarification path.',
    layoutDirection: 'LR',
    nodes: [
      // Main horizontal flow
      { id: 'bla-start', type: 'start', data: { id: 'bla-start', label: 'Loan Application Received', backgroundColor: defaultBgColor, nodeType: 'start' }, position: { x: 50, y: 300 }, width: wideWidth, height: 60 },
      { id: 'bla-action-docs', type: 'action', data: { id: 'bla-action-docs', label: 'Document Verification', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 350, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-docs', type: 'condition', data: { id: 'bla-cond-docs', label: 'Docs OK?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 600, y: 300 }, width: defaultWidth, height: conditionHeight },
      
      // Document failure path - upper branch
      { id: 'bla-action-request-info', type: 'action', data: { id: 'bla-action-request-info', label: 'Request Add. Info', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 600, y: 150 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-incomplete', type: 'end', data: { id: 'bla-end-incomplete', label: 'App. Incomplete', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 850, y: 150 }, width: defaultWidth, height: 60 },
      
      // Success path continues horizontally
      { id: 'bla-action-credit', type: 'action', data: { id: 'bla-action-credit', label: 'Credit Check', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 850, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-credit', type: 'condition', data: { id: 'bla-cond-credit', label: 'Credit Score OK?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 1100, y: 300 }, width: defaultWidth, height: conditionHeight },
      { id: 'bla-action-risk', type: 'action', data: { id: 'bla-action-risk', label: 'Risk Assessment', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 1350, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-risk', type: 'condition', data: { id: 'bla-cond-risk', label: 'Risk Low?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 1600, y: 300 }, width: defaultWidth, height: conditionHeight },
      
      // Final approval path - upper branch
      { id: 'bla-action-approve', type: 'action', data: { id: 'bla-action-approve', label: 'Approve Loan & Disburse', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 1600, y: 150 }, width: wideWidth, height: defaultHeight },
      { id: 'bla-end-approved', type: 'end', data: { id: 'bla-end-approved', label: 'Loan Approved', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 1900, y: 150 }, width: defaultWidth, height: 60 },
      
      // Rejection path - lower branch
      { id: 'bla-action-reject', type: 'action', data: { id: 'bla-action-reject', label: 'Notify Rejection', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 1350, y: 450 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-rejected', type: 'end', data: { id: 'bla-end-rejected', label: 'Loan Rejected', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 1600, y: 450 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'bla-e-start-docs', type: 'dotFlow', source: 'bla-start', target: 'bla-action-docs', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-docs-cond', type: 'dotFlow', source: 'bla-action-docs', target: 'bla-cond-docs', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-conddocs-credit', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-true', target: 'bla-action-credit', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-conddocs-reqinfo', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-false', target: 'bla-action-request-info', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-reqinfo-endinc', type: 'dotFlow', source: 'bla-action-request-info', target: 'bla-end-incomplete', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-credit-cond', type: 'dotFlow', source: 'bla-action-credit', target: 'bla-cond-credit', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condcred-risk', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-true', target: 'bla-action-risk', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condcred-reject', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-risk-cond', type: 'dotFlow', source: 'bla-action-risk', target: 'bla-cond-risk', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condrisk-approve', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-true', target: 'bla-action-approve', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condrisk-reject', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-approve-end', type: 'dotFlow', source: 'bla-action-approve', target: 'bla-end-approved', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-reject-end', type: 'dotFlow', source: 'bla-action-reject', target: 'bla-end-rejected', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
    ],
  },
  {
    name: 'Share Market Trading',
    description: 'Workflow for a share market buy order, with partial fill handling.',
    layoutDirection: 'TB',
    nodes: [
      // Main validation flow - centered
      { id: 'smt-start', type: 'start', data: { id: 'smt-start', label: 'User Places Buy Order', backgroundColor: defaultBgColor, nodeType: 'start' }, position: { x: 400, y: 50 }, width: wideWidth, height: 60 },
      { id: 'smt-action-validate', type: 'action', data: { id: 'smt-action-validate', label: 'Validate Order (Funds, Stock)', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 150 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-cond-valid', type: 'condition', data: { id: 'smt-cond-valid', label: 'Order Valid?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 400, y: 280 }, width: defaultWidth, height: conditionHeight },
      
      // Success path - center
      { id: 'smt-action-exchange', type: 'action', data: { id: 'smt-action-exchange', label: 'Send to Exchange', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 420 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-cond-executed', type: 'condition', data: { id: 'smt-cond-executed', label: 'Order Fully Executed?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 400, y: 560 }, width: defaultWidth, height: conditionHeight },
      
      // Full execution path - left
      { id: 'smt-action-confirm-full', type: 'action', data: { id: 'smt-action-confirm-full', label: 'Confirm Full Execution', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 150, y: 700 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-end-success', type: 'end', data: { id: 'smt-end-success', label: 'Trade Successful (Full)', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 150, y: 840 }, width: wideWidth, height: 60 },
      
      // Partial fill handling - center-right
      { id: 'smt-cond-partial-fill', type: 'condition', data: { id: 'smt-cond-partial-fill', label: 'Partially Filled?', backgroundColor: defaultBgColor, nodeType: 'condition' }, position: { x: 650, y: 700 }, width: defaultWidth, height: conditionHeight },
      { id: 'smt-action-notify-partial', type: 'action', data: { id: 'smt-action-notify-partial', label: 'Notify Partial Fill & Update', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 500, y: 840 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-end-partial', type: 'end', data: { id: 'smt-end-partial', label: 'Order Partially Completed', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 500, y: 980 }, width: wideWidth, height: 60 },
      
      // Complete failure path - right
      { id: 'smt-action-failed-exchange', type: 'action', data: { id: 'smt-action-failed-exchange', label: 'Notify Order Failure (Exchange)', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 800, y: 840 }, width: wideWidth, height: defaultHeight },
      { id: 'smt-end-failed-exchange', type: 'end', data: { id: 'smt-end-failed-exchange', label: 'Trade Failed (Exchange)', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 800, y: 980 }, width: wideWidth, height: 60 },
      
      // Validation failure path - far right
      { id: 'smt-action-failed-validation', type: 'action', data: { id: 'smt-action-failed-validation', label: 'Notify Order Invalid', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 700, y: 420 }, width: defaultWidth, height: defaultHeight },
      { id: 'smt-end-failed-validation', type: 'end', data: { id: 'smt-end-failed-validation', label: 'Trade Invalid', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 700, y: 560 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'smt-e-start-validate', type: 'dotFlow', source: 'smt-start', target: 'smt-action-validate', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-validate-cond', type: 'dotFlow', source: 'smt-action-validate', target: 'smt-cond-valid', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condvalid-exchange', type: 'dotFlow', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-true', target: 'smt-action-exchange', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condvalid-failval', type: 'dotFlow', source: 'smt-cond-valid', sourceHandle: 'smt-cond-valid-source-false', target: 'smt-action-failed-validation', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-failval-end', type: 'dotFlow', source: 'smt-action-failed-validation', target: 'smt-end-failed-validation', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-exchange-condexe', type: 'dotFlow', source: 'smt-action-exchange', target: 'smt-cond-executed', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condexe-confirmfull', type: 'dotFlow', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-true', target: 'smt-action-confirm-full', label: 'Yes (Full)', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-confirmfull-endsuccess', type: 'dotFlow', source: 'smt-action-confirm-full', target: 'smt-end-success', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condexe-condpartial', type: 'dotFlow', source: 'smt-cond-executed', sourceHandle: 'smt-cond-executed-source-false', target: 'smt-cond-partial-fill', label: 'No (Not Full)', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condpartial-notifypartial', type: 'dotFlow', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-true', target: 'smt-action-notify-partial', label: 'Yes (Partial)', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-notifypartial-endpartial', type: 'dotFlow', source: 'smt-action-notify-partial', target: 'smt-end-partial', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-condpartial-failexchange', type: 'dotFlow', source: 'smt-cond-partial-fill', sourceHandle: 'smt-cond-partial-fill-source-false', target: 'smt-action-failed-exchange', label: 'No (Complete Fail)', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'smt-e-failexchange-end', type: 'dotFlow', source: 'smt-action-failed-exchange', target: 'smt-end-failed-exchange', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
    ],
  },
  {
    name: 'ML Model Building',
    description: 'Workflow for building a machine learning model: from data collection to deployment.',
    layoutDirection: 'TB',
    nodes: [
      // Linear vertical flow with improved spacing
      { id: 'ml-start', type: 'start', data: { id: 'ml-start', label: 'Start ML Pipeline', backgroundColor: defaultBgColor, nodeType: 'start' }, position: { x: 400, y: 50 }, width: defaultWidth, height: 60 },
      { id: 'ml-data-collection', type: 'action', data: { id: 'ml-data-collection', label: 'Data Collection', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 170 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-data-cleaning', type: 'action', data: { id: 'ml-data-cleaning', label: 'Data Cleaning', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 290 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-feature-eng', type: 'action', data: { id: 'ml-feature-eng', label: 'Feature Engineering', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 410 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-correlation', type: 'action', data: { id: 'ml-correlation', label: 'Correlation Analysis', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 530 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-clustering', type: 'action', data: { id: 'ml-clustering', label: 'Clustering', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 650 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-model-training', type: 'action', data: { id: 'ml-model-training', label: 'Model Training', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 770 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-model-fitting', type: 'action', data: { id: 'ml-model-fitting', label: 'Model Fitting', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 890 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-evaluation', type: 'action', data: { id: 'ml-evaluation', label: 'Model Evaluation', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 1010 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-deployment', type: 'action', data: { id: 'ml-deployment', label: 'Model Deployment', backgroundColor: defaultBgColor, nodeType: 'action' }, position: { x: 400, y: 1130 }, width: wideWidth, height: defaultHeight },
      { id: 'ml-end', type: 'end', data: { id: 'ml-end', label: 'End ML Pipeline', backgroundColor: defaultBgColor, nodeType: 'end' }, position: { x: 400, y: 1250 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'ml-e-start-collection', type: 'dotFlow', source: 'ml-start', target: 'ml-data-collection', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-collection-cleaning', type: 'dotFlow', source: 'ml-data-collection', target: 'ml-data-cleaning', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-cleaning-featureeng', type: 'dotFlow', source: 'ml-data-cleaning', target: 'ml-feature-eng', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-featureeng-correlation', type: 'dotFlow', source: 'ml-feature-eng', target: 'ml-correlation', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-correlation-clustering', type: 'dotFlow', source: 'ml-correlation', target: 'ml-clustering', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-clustering-training', type: 'dotFlow', source: 'ml-clustering', target: 'ml-model-training', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-training-fitting', type: 'dotFlow', source: 'ml-model-training', target: 'ml-model-fitting', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-fitting-eval', type: 'dotFlow', source: 'ml-model-fitting', target: 'ml-evaluation', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-eval-deploy', type: 'dotFlow', source: 'ml-evaluation', target: 'ml-deployment', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
      { id: 'ml-e-deploy-end', type: 'dotFlow', source: 'ml-deployment', target: 'ml-end', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge, completed: false } },
    ],
  },
];
