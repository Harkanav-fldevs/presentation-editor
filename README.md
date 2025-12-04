# AI Presentation Editor

A modern presentation editor built with Next.js 15, Tiptap, and Mastra.ai that converts JSON content into beautiful presentations.

## Features

- 🤖 **AI-Powered Generation**: Uses Mastra.ai to convert JSON content into structured presentations
- ✏️ **Rich Text Editor**: Built with Tiptap for powerful slide editing capabilities
- 🎨 **Multiple Themes**: Choose from modern, dark, and minimal themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 📤 **Export Options**: Export presentations as PDF or HTML
- 🔄 **Real-time Editing**: Live preview and editing with auto-save
- 📋 **Slide Management**: Add, delete, and reorder slides easily

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Editor**: Tiptap 2.x with ProseMirror
- **AI Backend**: Mastra.ai with OpenAI GPT-4
- **UI Components**: shadcn/ui with Tailwind CSS
- **State Management**: Zustand
- **Export**: Puppeteer for PDF generation

## Getting Started

### Prerequisites

- Node.js 20.9.0 or higher
- OpenAI API key

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd presentation-editor
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### 1. Input JSON Content

On the home page, enter your presentation content in JSON format:

```json
{
  "title": "My Presentation",
  "description": "A brief description",
  "content": [
    {
      "section": "Introduction",
      "content": "Welcome to our presentation...",
      "type": "text"
    },
    {
      "section": "Key Points",
      "content": "• First point\n• Second point\n• Third point",
      "type": "list"
    }
  ]
}
```

### 2. Generate Presentation

Click "Generate Presentation" to process your JSON content with AI and create a structured presentation.

### 3. Edit Slides

Use the rich text editor to:

- Edit slide content with formatting options
- Change slide types and layouts
- Add, delete, and reorder slides
- Apply different themes

### 4. Export

Export your presentation as:

- **PDF**: For printing or sharing
- **HTML**: For web viewing

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   ├── editor/            # Editor page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── editor/            # Editor components
│   ├── presentation/      # Presentation components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions and types
├── mastra/                # Mastra.ai backend
│   ├── agents/            # AI agents
│   ├── tools/             # Tools for agents
│   ├── workflows/         # Workflow definitions
│   └── types/             # TypeScript types
└── stores/                # Zustand state stores
```

## API Endpoints

- `POST /api/presentations/generate` - Generate presentation from JSON
- `POST /api/presentations/export` - Export presentation as PDF/HTML

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features

1. **New Slide Types**: Add to `SlideType` in `src/lib/presentation-types.ts`
2. **New Themes**: Add to `PRESENTATION_THEMES` in `src/lib/presentation-types.ts`
3. **New Export Formats**: Extend the export API in `src/app/api/presentations/export/route.ts`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions, please open an issue on GitHub.
