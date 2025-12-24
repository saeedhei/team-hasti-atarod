// app/boards/[boardSlug]/BoardClient.tsx
'use client';

import { useMemo, useState } from 'react';
import { createCardAction, createListAction, deleteListAction, deleteCardAction } from './actions';

import { CardDetails } from './CardDetails';
import type { Board } from '@/types/board';
import type { List } from '@/types/list';
import type { Card } from '@/types/card';

import { Drawer, DrawerContent } from '@/components/ui/drawer';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// ---------------------- Card view ----------------------

const CardView = ({ card, onClick }: { card: Card; onClick?: () => void }) => (
  <article
    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-sm font-semibold">{card.title}</h3>

    {card.description && <p className="text-xs text-slate-600 mt-2">{card.description}</p>}

    <div className="mt-3 flex items-center justify-between gap-2">
      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {card.tags?.slice(0, 3).map((t) => (
          <Badge key={t.id} className="text-xs py-1 px-2">
            {t.label}
          </Badge>
        ))}
      </div>

      {/* Progress + Assignee */}
      <div className="flex items-center gap-2">
        {typeof card.progress === 'number' && (
          <div className="w-24 text-xs">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-yellow-500"
                style={{
                  width: `${Math.min(100, Math.max(0, card.progress))}%`,
                }}
              />
            </div>
            <div className="text-slate-500 text-[10px] mt-1">{card.progress}%</div>
          </div>
        )}

        {card.assignee && (
          <Avatar className="h-7 w-7">
            <AvatarFallback>
              {card.assignee.initials ?? card.assignee.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  </article>
);

// ---------------------- List View ----------------------
const ListView = ({
  list,
  cards,
  onCardClick,
  onAddCardClick,
  onDeleteList,
  onDeleteCard,
}: {
  list: List;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddCardClick: (listId: string) => void;
  onDeleteList: (listId: string) => void;
  onDeleteCard: (cardId: string) => void;
}) => (
  <section className="w-full max-w-xs">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold flex items-center gap-2">
        <span className={cn('inline-block h-3 w-3 rounded-full', list.color ?? 'bg-slate-400')} />
        {list.title}
      </h2>
      {/* Delete List Button */}
      <button
        className="text-red-500 hover:text-red-700 text-xs"
        onClick={() => onDeleteList(list._id)}
      >
        Delete
      </button>
    </div>

    <div className="space-y-3">
      {cards.map((card) => (
        <div key={card._id} className="relative">
          <CardView card={card} onClick={() => onCardClick(card)} />
          {/* Delete Card Button */}
          <button
            className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteCard(card._id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>

    <Button
      variant="outline"
      size="sm"
      className="w-full mt-3 cursor-pointer"
      onClick={() => onAddCardClick(list._id)}
    >
      + Add Card
    </Button>
  </section>
);

// ---------------------- Main Component ----------------------
export default function BoardClient({
  initialBoard,
  initialLists,
  initialCards,
}: {
  initialBoard: Board;
  initialLists: List[];
  initialCards: Card[];
}) {
  const [board] = useState<Board>(initialBoard);
  const [lists, setLists] = useState<List[]>(initialLists);
  const [cards, setCards] = useState<Card[]>(initialCards);

  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [targetListId, setTargetListId] = useState<string | null>(null);

  //Sort cards per list by createdAt
  const cardsByList = useMemo(() => {
    const map: Record<string, Card[]> = {};
    for (const card of cards) {
      if (!map[card.listId]) map[card.listId] = [];
      map[card.listId].push(card);
    }
    // After grouping cards by list, re-assert the order defined by the DB (createdAt asc)
    for (const listId in map) {
      map[listId].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    }
    return map;
  }, [cards]);

  // ---------------- Add  card----------------
  const addCard = async (
    listId: string,
    payload: Pick<Card, 'title' | 'description' | 'priority'>,
  ) => {
    const tempCardId = `card:temp-${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    // Optimistic UI update
    setCards((prev) => [
      ...prev,
      {
        _id: tempCardId,
        type: 'card',
        boardId: board._id,
        listId,
        title: payload.title,
        description: payload.description,
        priority: payload.priority ?? 'low',
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const realCard = await createCardAction(
      {
        title: payload.title,
        description: payload.description,
        priority: payload.priority ?? 'low',
      },
      board._id,
      listId,
      board.slug,
    );
    // Reconcile temp to real
    setCards((prev) => prev.map((c) => (c._id === tempCardId ? realCard : c)));
  };

  // ---------------- Add List ----------------
  const addList = async (title: string) => {
    const tempListId = `list:temp-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    // Optimistic UI update
    setLists((prev) => [
      ...prev,
      {
        _id: tempListId,
        type: 'list',
        boardId: board._id,
        title,
        color: 'bg-slate-300',
        createdAt: now,
        updatedAt: now,
      },
    ]);
    const realList = await createListAction(
      {
        title,
        color: 'bg-slate-300',
      },
      board._id,
      board.slug,
    );
    // Reconcile temp to real
    setLists((prev) => prev.map((l) => (l._id === tempListId ? realList : l)));
  };

  // ---------------- Delete List ----------------
  const deleteList = async (listId: string) => {
    // Optimistic UI update
    setLists((prev) => prev.filter((l) => l._id !== listId));
    setCards((prev) => prev.filter((c) => c.listId !== listId));
    await deleteListAction(board._id, listId, board.slug);
  };
  // ---------------- Delete Card ----------------
  const deleteCard = async (cardId: string) => {
    const card = cards.find((c) => c._id === cardId);
    if (!card) return;

    // Optimistic update
    setCards((prev) => prev.filter((c) => c._id !== cardId));

    await deleteCardAction(board._id, cardId, card.listId, board.slug);
  };

  return (
    <main className="p-6 max-w-full">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{board.title}</h1>

        <Dialog open={isCreatingList} onOpenChange={setIsCreatingList}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreatingList(true)}>Add List</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create List</DialogTitle>
            </DialogHeader>

            <CreateListForm
              onCreate={(title) => {
                addList(title);
                setIsCreatingList(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </header>
      {/* Create Card Dialog */}
      <Dialog open={isCreatingCard} onOpenChange={setIsCreatingCard}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Card</DialogTitle>
          </DialogHeader>

          <CreateCardForm
            lists={lists}
            selectedListId={targetListId ?? undefined}
            onCreate={(listId, payload) => {
              addCard(listId, payload);
              setIsCreatingCard(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Card Drawer */}
      <Drawer open={isCardOpen} onOpenChange={setIsCardOpen}>
        <DrawerContent className="w-1/2 ml-auto p-6 overflow-auto">
          {selectedCard && <CardDetails card={selectedCard} onClose={() => setIsCardOpen(false)} />}
        </DrawerContent>
      </Drawer>

      {/* Lists */}
      <section className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
        {lists.map((list) => (
          <div key={list._id} className="shrink-0" style={{ width: 270 }}>
            <ListView
              list={list}
              cards={cardsByList[list._id] ?? []}
              onCardClick={(card) => {
                setSelectedCard(card);
                setIsCardOpen(true);
              }}
              onAddCardClick={(listId) => {
                setTargetListId(listId);
                setIsCreatingCard(true);
              }}
              onDeleteList={(listId) => deleteList(listId)}
              onDeleteCard={(cardId) => deleteCard(cardId)}
            />
          </div>
        ))}
      </section>
    </main>
  );
}

// ---------------------- Create Card Form ----------------------
const CreateCardForm = ({
  lists,
  selectedListId,
  onCreate,
}: {
  lists: List[];
  selectedListId?: string;
  onCreate: (listId: string, payload: Pick<Card, 'title' | 'description' | 'priority'>) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [listId, setListId] = useState(selectedListId ?? lists[0]?._id ?? '');
  const [priority, setPriority] = useState<Card['priority']>('low');

  const disabled = title.trim().length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) {
          onCreate(listId, {
            title: title.trim(),
            description: description.trim() || undefined,
            priority,
          });

          setTitle('');
          setDescription('');
        }
      }}
      className="space-y-4"
    >
      {/* Title */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* List Select */}
      <div>
        <Label>List</Label>
        <select
          className="w-full p-2 border rounded-md"
          value={listId}
          onChange={(e) => setListId(e.target.value)}
        >
          {lists.map((l) => (
            <option key={l._id} value={l._id}>
              {l.title}
            </option>
          ))}
        </select>
      </div>

      {/* Priority */}
      <div>
        <Label>Priority</Label>
        <div className="flex gap-2 mt-1">
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={cn(
                'px-3 py-1 rounded-md border',
                priority === p ? 'border-black' : 'border-slate-200',
              )}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Create
        </Button>
      </div>
    </form>
  );
};

// ---------------------- Create List Form ----------------------
const CreateListForm = ({ onCreate }: { onCreate: (title: string) => void }) => {
  const [title, setTitle] = useState('');

  const disabled = title.trim().length === 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled) {
          onCreate(title.trim());
          setTitle('');
        }
      }}
      className="space-y-4"
    >
      <div>
        <Label className="mb-1" htmlFor="list-title">
          List Title
        </Label>
        <Input id="list-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={disabled}>
          Create List
        </Button>
      </div>
    </form>
  );
};
