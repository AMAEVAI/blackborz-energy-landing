'use client';
import { useState, useCallback } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';
import { useLeadsStore } from '@/store/leadsStore';
import { Lead, LeadStatus } from '@/lib/types';
import { KANBAN_COLUMNS } from '@/lib/mockData';
import LeadCard from './LeadCard';
import LeadModal from './LeadModal';
import AddLeadModal from './AddLeadModal';
import { Plus, Search } from 'lucide-react';
import { useT } from '@/lib/i18n/LanguageContext';

export default function KanbanBoard() {
  const { getLeadsByStatus, moveLead, searchQuery, setSearchQuery } = useLeadsStore();
  const { t } = useT();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      const { draggableId, destination } = result;
      moveLead(draggableId, destination.droppableId as LeadStatus);
    },
    [moveLead]
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#141414] border border-[#242424] rounded-xl text-sm text-white placeholder:text-[#555] focus:outline-none focus:border-[#c8ff00]/40 transition-colors"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-3 md:px-4 py-2 bg-[#c8ff00] hover:bg-[#b8ef00] text-black rounded-xl text-sm font-bold transition-all flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">{t('leads.addLead')}</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-3 overflow-x-auto pb-4 flex-1 snap-x snap-mandatory">
          {KANBAN_COLUMNS.map((col) => {
            const leads = getLeadsByStatus(col.id);
            const totalValue = leads.reduce((s, l) => s + l.value, 0);

            return (
              <div key={col.id} className="flex-shrink-0 w-[82vw] md:w-72 flex flex-col snap-start">
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-xl mb-2 ${col.bgColor} border ${col.borderColor}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="text-sm font-semibold text-white">{t(`status.${col.id}`)}</span>
                    <span className="text-xs px-1.5 py-0.5 bg-black/30 text-white/60 rounded-full font-medium">
                      {leads.length}
                    </span>
                  </div>
                  {totalValue > 0 && (
                    <span className="text-xs text-white/50">
                      {totalValue >= 1_000_000
                        ? `${(totalValue / 1_000_000).toFixed(1)}M €`
                        : `${(totalValue / 1_000).toFixed(0)}K €`}
                    </span>
                  )}
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-24 rounded-xl transition-colors p-2 space-y-2 ${
                        snapshot.isDraggingOver
                          ? 'bg-[#c8ff00]/5 border border-[#c8ff00]/20'
                          : 'bg-[#0a0a0a] border border-[#161616]'
                      }`}
                    >
                      {leads.map((lead, index) => (
                        <Draggable key={lead.id} draggableId={lead.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                            >
                              <LeadCard
                                lead={lead}
                                onClick={setSelectedLead}
                                isDragging={snap.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {leads.length === 0 && !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-16 text-xs text-[#333]">
                          {t('common.empty')}
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {selectedLead && (
        <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
      {showAddModal && (
        <AddLeadModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
