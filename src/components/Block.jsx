import ParagraphBlock from './blocks/ParagraphBlock.jsx'
import DefinitionsBlock from './blocks/DefinitionsBlock.jsx'
import CalloutBlock from './blocks/CalloutBlock.jsx'
import ReferenceBlock from './blocks/ReferenceBlock.jsx'
import FlashcardsBlock from './blocks/FlashcardsBlock.jsx'
import './blocks/Blocks.css'
import './Block.css'

const BLOCK_COMPONENTS = {
  paragraph: ParagraphBlock,
  definitions: DefinitionsBlock,
  callout: CalloutBlock,
  reference: ReferenceBlock,
  flashcards: FlashcardsBlock,
}

export default function Block({ block, isFirst, isLast, onChange, onDelete, onMoveUp, onMoveDown, autoFocus }) {
  const Content = BLOCK_COMPONENTS[block.type]
  if (!Content) return null

  return (
    <div className="block">
      <div className="block-actions">
        <button
          type="button"
          className="icon-btn"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Move block up"
          title="Move up"
        >
          &uarr;
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Move block down"
          title="Move down"
        >
          &darr;
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={onDelete}
          aria-label="Delete block"
          title="Delete"
        >
          &times;
        </button>
      </div>
      <div className="block-content">
        <Content block={block} onChange={onChange} autoFocus={autoFocus} />
      </div>
    </div>
  )
}
