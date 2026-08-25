import ParagraphView from './blocks/ParagraphView.jsx'
import DefinitionsView from './blocks/DefinitionsView.jsx'
import CalloutView from './blocks/CalloutView.jsx'
import ReferenceView from './blocks/ReferenceView.jsx'
import FlashcardsView from './blocks/FlashcardsView.jsx'
import ImageView from './blocks/ImageView.jsx'
import LinkView from './blocks/LinkView.jsx'

const VIEW_COMPONENTS = {
  paragraph: ParagraphView,
  definitions: DefinitionsView,
  callout: CalloutView,
  reference: ReferenceView,
  flashcards: FlashcardsView,
  image: ImageView,
  link: LinkView,
}

export default function BlockView({ block }) {
  const Content = VIEW_COMPONENTS[block.type]
  if (!Content) return null
  return <Content block={block} />
}
