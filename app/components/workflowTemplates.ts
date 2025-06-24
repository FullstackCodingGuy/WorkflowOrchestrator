import { Node, Edge } from 'reactflow';
import { APP_COLORS, NODE_DIMENSIONS, getNodeTypeStyles } from '../config/appConfig';

export interface WorkflowTemplate {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  layoutDirection: 'TB' | 'LR';
}

// Helper function to create node data with centralized styling
const createNodeData = (
  id: string, 
  label: string, 
  nodeType: 'start' | 'process' | 'action' | 'condition' | 'decision' | 'end' | 'custom',
  customOverrides: Record<string, unknown> = {}
) => {
  const baseStyles = getNodeTypeStyles(nodeType);
  return {
    id,
    label,
    nodeType,
    ...baseStyles,
    ...customOverrides,
  };
};

const defaultWidth = NODE_DIMENSIONS.defaultWidth;
const defaultHeight = NODE_DIMENSIONS.defaultHeight;
const conditionHeight = NODE_DIMENSIONS.conditionHeight;
const wideWidth = NODE_DIMENSIONS.wideWidth;

export const workflowTemplates: WorkflowTemplate[] = [
  {
    name: 'E-Commerce Order Processing',
    description: 'A real-time 5-step order processing workflow: Order Received → Validate Payment → Process Order → Fulfill Order → Order Complete.',
    layoutDirection: 'TB',
    nodes: [
      {
        id: 'eop-start',
        type: 'start',
        data: createNodeData('eop-start', 'Order Received', 'start'),
        position: { x: 300, y: 50 },
        width: defaultWidth,
        height: 60,
      },
      {
        id: 'eop-validate',
        type: 'action',
        data: createNodeData('eop-validate', 'Validate Payment', 'action'),
        position: { x: 300, y: 170 },
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-process',
        type: 'process',
        data: createNodeData('eop-process', 'Process Order Items', 'process'),
        position: { x: 300, y: 290 },
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-fulfill',
        type: 'action',
        data: createNodeData('eop-fulfill', 'Package & Ship', 'action'),
        position: { x: 300, y: 410 },
        width: defaultWidth,
        height: defaultHeight,
      },
      {
        id: 'eop-complete',
        type: 'end',
        data: createNodeData('eop-complete', 'Order Complete', 'end'),
        position: { x: 300, y: 530 },
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
      { id: 'itu-start', type: 'start', data: createNodeData('itu-start', 'New User Request', 'start'), position: { x: 400, y: 50 }, width: defaultWidth, height: 60 },
      { id: 'itu-action-hr', type: 'action', data: createNodeData('itu-action-hr', 'HR Verification', 'action'), position: { x: 400, y: 150 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-cond-hr', type: 'condition', data: createNodeData('itu-cond-hr', 'HR Approved?', 'condition'), position: { x: 400, y: 280 }, width: defaultWidth, height: conditionHeight },
      
      // Success path - center-left
      { id: 'itu-action-it-setup', type: 'action', data: createNodeData('itu-action-it-setup', 'Attempt IT Account Setup', 'action'), position: { x: 400, y: 420 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-cond-it-setup-ok', type: 'condition', data: createNodeData('itu-cond-it-setup-ok', 'IT Setup Successful?', 'condition'), position: { x: 400, y: 560 }, width: defaultWidth, height: conditionHeight },
      { id: 'itu-action-resource', type: 'action', data: createNodeData('itu-action-resource', 'Allocate Resources', 'action'), position: { x: 200, y: 700 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-action-notify', type: 'action', data: createNodeData('itu-action-notify', 'Notify User & Manager', 'action'), position: { x: 200, y: 840 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-complete', type: 'end', data: createNodeData('itu-end-complete', 'Onboarding Complete', 'end'), position: { x: 200, y: 980 }, width: defaultWidth, height: 60 },
      
      // IT failure path - center-right
      { id: 'itu-action-log-issue', type: 'action', data: createNodeData('itu-action-log-issue', 'Log IT Issue / Escalate', 'action'), position: { x: 600, y: 700 }, width: wideWidth, height: defaultHeight },
      { id: 'itu-end-delayed', type: 'end', data: createNodeData('itu-end-delayed', 'Onboarding Delayed/Issue', 'end'), position: { x: 600, y: 840 }, width: wideWidth, height: 60 },
      
      // HR rejection path - right
      { id: 'itu-action-reject-hr', type: 'action', data: createNodeData('itu-action-reject-hr', 'Notify HR Rejection', 'action'), position: { x: 700, y: 420 }, width: defaultWidth, height: defaultHeight },
      { id: 'itu-end-rejected-hr', type: 'end', data: createNodeData('itu-end-rejected-hr', 'Onboarding Rejected (HR)', 'end'), position: { x: 700, y: 560 }, width: wideWidth, height: 60 },
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
      { id: 'bla-start', type: 'start', data: createNodeData('bla-start', 'Loan Application Received', 'start'), position: { x: 50, y: 300 }, width: wideWidth, height: 60 },
      { id: 'bla-action-docs', type: 'action', data: createNodeData('bla-action-docs', 'Document Verification', 'action'), position: { x: 350, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-docs', type: 'condition', data: createNodeData('bla-cond-docs', 'Docs OK?', 'condition'), position: { x: 600, y: 300 }, width: defaultWidth, height: conditionHeight },
      
      // Document failure path - upper branch
      { id: 'bla-action-request-info', type: 'action', data: createNodeData('bla-action-request-info', 'Request Add. Info', 'action'), position: { x: 600, y: 150 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-incomplete', type: 'end', data: createNodeData('bla-end-incomplete', 'App. Incomplete', 'end'), position: { x: 850, y: 150 }, width: defaultWidth, height: 60 },
      
      // Success path continues horizontally
      { id: 'bla-action-credit', type: 'action', data: createNodeData('bla-action-credit', 'Credit Check', 'action'), position: { x: 850, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-credit', type: 'condition', data: createNodeData('bla-cond-credit', 'Credit Score OK?', 'condition'), position: { x: 1100, y: 300 }, width: defaultWidth, height: conditionHeight },
      { id: 'bla-action-risk', type: 'action', data: createNodeData('bla-action-risk', 'Risk Assessment', 'action'), position: { x: 1350, y: 300 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-cond-risk', type: 'condition', data: createNodeData('bla-cond-risk', 'Risk Low?', 'condition'), position: { x: 1600, y: 300 }, width: defaultWidth, height: conditionHeight },
      
      // Final approval path - upper branch
      { id: 'bla-action-approve', type: 'action', data: createNodeData('bla-action-approve', 'Approve Loan & Disburse', 'action'), position: { x: 1600, y: 150 }, width: wideWidth, height: defaultHeight },
      { id: 'bla-end-approved', type: 'end', data: createNodeData('bla-end-approved', 'Loan Approved', 'end'), position: { x: 1900, y: 150 }, width: defaultWidth, height: 60 },
      
      // Rejection path - lower branch
      { id: 'bla-action-reject', type: 'action', data: createNodeData('bla-action-reject', 'Notify Rejection', 'action'), position: { x: 1350, y: 450 }, width: defaultWidth, height: defaultHeight },
      { id: 'bla-end-rejected', type: 'end', data: createNodeData('bla-end-rejected', 'Loan Rejected', 'end'), position: { x: 1600, y: 450 }, width: defaultWidth, height: 60 },
    ],
    edges: [
      { id: 'bla-e-start-docs', type: 'dotFlow', source: 'bla-start', target: 'bla-action-docs', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-docs-cond', type: 'dotFlow', source: 'bla-action-docs', target: 'bla-cond-docs', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-conddocs-credit', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-true', target: 'bla-action-credit', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-conddocs-reqinfo', type: 'dotFlow', source: 'bla-cond-docs', sourceHandle: 'bla-cond-docs-source-false', target: 'bla-action-request-info', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-reqinfo-incomplete', type: 'dotFlow', source: 'bla-action-request-info', target: 'bla-end-incomplete', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-credit-condcredit', type: 'dotFlow', source: 'bla-action-credit', target: 'bla-cond-credit', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condcredit-risk', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-true', target: 'bla-action-risk', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condcredit-reject', type: 'dotFlow', source: 'bla-cond-credit', sourceHandle: 'bla-cond-credit-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-risk-condrisk', type: 'dotFlow', source: 'bla-action-risk', target: 'bla-cond-risk', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condrisk-approve', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-true', target: 'bla-action-approve', label: 'Yes', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-condrisk-reject', type: 'dotFlow', source: 'bla-cond-risk', sourceHandle: 'bla-cond-risk-source-false', target: 'bla-action-reject', label: 'No', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-approve-approved', type: 'dotFlow', source: 'bla-action-approve', target: 'bla-end-approved', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
      { id: 'bla-e-reject-rejected', type: 'dotFlow', source: 'bla-action-reject', target: 'bla-end-rejected', animated: false, data: { animatedColor: APP_COLORS.animatedEdge, completedColor: APP_COLORS.completedEdge } },
    ],
  },

  // Enhanced Design Example 1: AI-Powered Content Creation Pipeline
  {
    name: 'AI Content Creation Pipeline',
    description: 'Advanced AI-driven content workflow with enhanced visual design: Content Request → AI Analysis → Multi-format Generation → Quality Review → Publishing with rich styling and animations.',
    layoutDirection: 'LR',
    nodes: [
      {
        id: 'ai-start',
        type: 'start',
        data: createNodeData('ai-start', '🚀 Content Request', 'start', {
          backgroundColor: '#4f46e5',
          borderColor: '#6366f1',
          textColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'bold',
          icon: '🚀',
        }),
        position: { x: 50, y: 200 },
        width: 180,
        height: 80,
      },
      {
        id: 'ai-analyze',
        type: 'process',
        data: createNodeData('ai-analyze', '🧠 AI Topic Analysis', 'process', {
          backgroundColor: '#06b6d4',
          borderColor: '#0891b2',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
          icon: '🧠',
        }),
        position: { x: 300, y: 200 },
        width: 200,
        height: 80,
      },
      {
        id: 'ai-generate',
        type: 'action',
        data: createNodeData('ai-generate', '✨ Generate Content', 'action', {
          backgroundColor: '#8b5cf6',
          borderColor: '#7c3aed',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
          icon: '✨',
        }),
        position: { x: 580, y: 200 },
        width: 180,
        height: 80,
      },
      {
        id: 'ai-branch',
        type: 'decision',
        data: createNodeData('ai-branch', '🔀 Content Type?', 'decision', {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '🔀',
        }),
        position: { x: 840, y: 200 },
        width: 160,
        height: 100,
      },
      {
        id: 'ai-blog',
        type: 'action',
        data: createNodeData('ai-blog', '📝 Blog Article', 'action', {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '📝',
        }),
        position: { x: 1100, y: 80 },
        width: 160,
        height: 70,
      },
      {
        id: 'ai-social',
        type: 'action',
        data: createNodeData('ai-social', '📱 Social Posts', 'action', {
          backgroundColor: '#ec4899',
          borderColor: '#db2777',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '📱',
        }),
        position: { x: 1100, y: 200 },
        width: 160,
        height: 70,
      },
      {
        id: 'ai-video',
        type: 'action',
        data: createNodeData('ai-video', '🎥 Video Script', 'action', {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '🎥',
        }),
        position: { x: 1100, y: 320 },
        width: 160,
        height: 70,
      },
      {
        id: 'ai-review',
        type: 'condition',
        data: createNodeData('ai-review', '👁️ Quality Review', 'condition', {
          backgroundColor: '#6366f1',
          borderColor: '#4f46e5',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '👁️',
        }),
        position: { x: 1380, y: 200 },
        width: 160,
        height: 100,
      },
      {
        id: 'ai-publish',
        type: 'action',
        data: createNodeData('ai-publish', '🌐 Publish Content', 'action', {
          backgroundColor: '#059669',
          borderColor: '#047857',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          icon: '🌐',
        }),
        position: { x: 1660, y: 200 },
        width: 180,
        height: 80,
      },
      {
        id: 'ai-end',
        type: 'end',
        data: createNodeData('ai-end', '✅ Content Live', 'end', {
          backgroundColor: '#16a34a',
          borderColor: '#15803d',
          textColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'bold',
          icon: '✅',
        }),
        position: { x: 1920, y: 200 },
        width: 160,
        height: 80,
      },
    ],
    edges: [
      { 
        id: 'ai-e1', 
        type: 'animated', 
        source: 'ai-start', 
        target: 'ai-analyze', 
        animated: true, 
        data: { 
          label: 'Request', 
          strokeWidth: 3,
          color: '#4f46e5',
          animationSpeed: 'fast',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e2', 
        type: 'animated', 
        source: 'ai-analyze', 
        target: 'ai-generate', 
        animated: true, 
        data: { 
          label: 'Analysis Complete', 
          strokeWidth: 3,
          color: '#06b6d4',
          animationSpeed: 'normal',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e3', 
        type: 'animated', 
        source: 'ai-generate', 
        target: 'ai-branch', 
        animated: true, 
        data: { 
          label: 'Content Ready', 
          strokeWidth: 3,
          color: '#8b5cf6',
          animationSpeed: 'normal',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e4', 
        type: 'smoothstep', 
        source: 'ai-branch', 
        sourceHandle: 'ai-branch-source-top',
        target: 'ai-blog', 
        data: { 
          label: 'Blog', 
          strokeWidth: 2,
          color: '#10b981',
          strokeStyle: 'dashed'
        } 
      },
      { 
        id: 'ai-e5', 
        type: 'smoothstep', 
        source: 'ai-branch', 
        target: 'ai-social', 
        data: { 
          label: 'Social', 
          strokeWidth: 2,
          color: '#ec4899',
          strokeStyle: 'dashed'
        } 
      },
      { 
        id: 'ai-e6', 
        type: 'smoothstep', 
        source: 'ai-branch', 
        sourceHandle: 'ai-branch-source-bottom',
        target: 'ai-video', 
        data: { 
          label: 'Video', 
          strokeWidth: 2,
          color: '#ef4444',
          strokeStyle: 'dashed'
        } 
      },
      { 
        id: 'ai-e7', 
        type: 'smoothstep', 
        source: 'ai-blog', 
        target: 'ai-review', 
        data: { 
          strokeWidth: 2,
          color: '#10b981',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e8', 
        type: 'smoothstep', 
        source: 'ai-social', 
        target: 'ai-review', 
        data: { 
          strokeWidth: 2,
          color: '#ec4899',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e9', 
        type: 'smoothstep', 
        source: 'ai-video', 
        target: 'ai-review', 
        data: { 
          strokeWidth: 2,
          color: '#ef4444',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e10', 
        type: 'animated', 
        source: 'ai-review', 
        target: 'ai-publish', 
        animated: true, 
        data: { 
          label: 'Approved', 
          strokeWidth: 4,
          color: '#059669',
          animationSpeed: 'fast',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'ai-e11', 
        type: 'animated', 
        source: 'ai-publish', 
        target: 'ai-end', 
        animated: true, 
        data: { 
          label: 'Published', 
          strokeWidth: 4,
          color: '#16a34a',
          animationSpeed: 'fast',
          strokeStyle: 'solid'
        } 
      },
    ],
  },

  // Enhanced Design Example 2: Smart Healthcare Diagnosis System
  {
    name: 'Smart Healthcare Diagnosis',
    description: 'Advanced medical diagnosis workflow with premium visual design: Patient Data → Symptom Analysis → AI Diagnosis → Treatment Plan → Follow-up with gradient colors and sophisticated animations.',
    layoutDirection: 'TB',
    nodes: [
      {
        id: 'med-start',
        type: 'start',
        data: createNodeData('med-start', '🏥 Patient Check-in', 'start', {
          backgroundColor: '#0ea5e9',
          borderColor: '#0284c7',
          textColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'bold',
          icon: '🏥',
        }),
        position: { x: 400, y: 50 },
        width: 200,
        height: 80,
      },
      {
        id: 'med-data',
        type: 'process',
        data: createNodeData('med-data', '📋 Collect Medical History', 'process', {
          backgroundColor: '#7c3aed',
          borderColor: '#6d28d9',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
          icon: '📋',
        }),
        position: { x: 400, y: 180 },
        width: 200,
        height: 80,
      },
      {
        id: 'med-symptoms',
        type: 'action',
        data: createNodeData('med-symptoms', '🔍 Symptom Analysis', 'action', {
          backgroundColor: '#f59e0b',
          borderColor: '#d97706',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: '600',
          icon: '🔍',
        }),
        position: { x: 400, y: 310 },
        width: 200,
        height: 80,
      },
      {
        id: 'med-ai',
        type: 'process',
        data: createNodeData('med-ai', '🤖 AI Diagnostic Engine', 'process', {
          backgroundColor: '#dc2626',
          borderColor: '#b91c1c',
          textColor: '#ffffff',
          fontSize: 14,
          fontWeight: 'bold',
          icon: '🤖',
        }),
        position: { x: 400, y: 440 },
        width: 200,
        height: 80,
      },
      {
        id: 'med-decision',
        type: 'decision',
        data: createNodeData('med-decision', '⚕️ Diagnosis Type?', 'decision', {
          backgroundColor: '#059669',
          borderColor: '#047857',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '⚕️',
        }),
        position: { x: 400, y: 570 },
        width: 200,
        height: 100,
      },
      {
        id: 'med-routine',
        type: 'action',
        data: createNodeData('med-routine', '💊 Routine Treatment', 'action', {
          backgroundColor: '#10b981',
          borderColor: '#059669',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '💊',
        }),
        position: { x: 100, y: 720 },
        width: 180,
        height: 70,
      },
      {
        id: 'med-specialist',
        type: 'action',
        data: createNodeData('med-specialist', '👨‍⚕️ Specialist Referral', 'action', {
          backgroundColor: '#ec4899',
          borderColor: '#db2777',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '👨‍⚕️',
        }),
        position: { x: 400, y: 720 },
        width: 180,
        height: 70,
      },
      {
        id: 'med-emergency',
        type: 'action',
        data: createNodeData('med-emergency', '🚨 Emergency Protocol', 'action', {
          backgroundColor: '#ef4444',
          borderColor: '#dc2626',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: 'bold',
          icon: '🚨',
        }),
        position: { x: 700, y: 720 },
        width: 180,
        height: 70,
      },
      {
        id: 'med-followup',
        type: 'condition',
        data: createNodeData('med-followup', '📅 Schedule Follow-up', 'condition', {
          backgroundColor: '#6366f1',
          borderColor: '#4f46e5',
          textColor: '#ffffff',
          fontSize: 13,
          fontWeight: '600',
          icon: '📅',
        }),
        position: { x: 400, y: 850 },
        width: 180,
        height: 80,
      },
      {
        id: 'med-end',
        type: 'end',
        data: createNodeData('med-end', '✅ Treatment Complete', 'end', {
          backgroundColor: '#16a34a',
          borderColor: '#15803d',
          textColor: '#ffffff',
          fontSize: 16,
          fontWeight: 'bold',
          icon: '✅',
        }),
        position: { x: 400, y: 980 },
        width: 200,
        height: 80,
      },
    ],
    edges: [
      { 
        id: 'med-e1', 
        type: 'animated', 
        source: 'med-start', 
        target: 'med-data', 
        animated: true, 
        data: { 
          label: 'Check-in', 
          strokeWidth: 3,
          color: '#0ea5e9',
          animationSpeed: 'normal',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e2', 
        type: 'animated', 
        source: 'med-data', 
        target: 'med-symptoms', 
        animated: true, 
        data: { 
          label: 'History Recorded', 
          strokeWidth: 3,
          color: '#7c3aed',
          animationSpeed: 'normal',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e3', 
        type: 'animated', 
        source: 'med-symptoms', 
        target: 'med-ai', 
        animated: true, 
        data: { 
          label: 'Symptoms Analyzed', 
          strokeWidth: 3,
          color: '#f59e0b',
          animationSpeed: 'slow',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e4', 
        type: 'animated', 
        source: 'med-ai', 
        target: 'med-decision', 
        animated: true, 
        data: { 
          label: 'AI Analysis', 
          strokeWidth: 4,
          color: '#dc2626',
          animationSpeed: 'fast',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e5', 
        type: 'smoothstep', 
        source: 'med-decision', 
        sourceHandle: 'med-decision-source-left',
        target: 'med-routine', 
        data: { 
          label: 'Routine', 
          strokeWidth: 2,
          color: '#10b981',
          strokeStyle: 'dashed'
        } 
      },
      { 
        id: 'med-e6', 
        type: 'smoothstep', 
        source: 'med-decision', 
        target: 'med-specialist', 
        data: { 
          label: 'Complex', 
          strokeWidth: 2,
          color: '#ec4899',
          strokeStyle: 'dashed'
        } 
      },
      { 
        id: 'med-e7', 
        type: 'smoothstep', 
        source: 'med-decision', 
        sourceHandle: 'med-decision-source-right',
        target: 'med-emergency', 
        data: { 
          label: 'Critical', 
          strokeWidth: 3,
          color: '#ef4444',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e8', 
        type: 'smoothstep', 
        source: 'med-routine', 
        target: 'med-followup', 
        data: { 
          strokeWidth: 2,
          color: '#10b981',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e9', 
        type: 'smoothstep', 
        source: 'med-specialist', 
        target: 'med-followup', 
        data: { 
          strokeWidth: 2,
          color: '#ec4899',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e10', 
        type: 'smoothstep', 
        source: 'med-emergency', 
        target: 'med-followup', 
        data: { 
          strokeWidth: 3,
          color: '#ef4444',
          strokeStyle: 'solid'
        } 
      },
      { 
        id: 'med-e11', 
        type: 'animated', 
        source: 'med-followup', 
        target: 'med-end', 
        animated: true, 
        data: { 
          label: 'Complete', 
          strokeWidth: 4,
          color: '#16a34a',
          animationSpeed: 'fast',
          strokeStyle: 'solid'
        } 
      },
    ],
  },
];
