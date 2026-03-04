import {
  Video,
  FileText,
  Link as LinkIcon,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";

function CardFeatures({ titulo, tipo, descricao, url, tags = [] }) {
  const getIconeTipo = () => {
    switch (tipo?.toLowerCase()) {
      case "pdf":
        return <FileText size={18} className="text-red-500" />;
      case "link":
        return <LinkIcon size={18} className="text-green-500" />;
      default:
        return <Video size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="bg-white w-1/4 flex flex-col justify-between p-5 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="bg-blue-50 w-max flex justify-center items-center rounded-full gap-2 px-3 py-1">
          {getIconeTipo()}
          <p className="text-blue-600 font-semibold text-xs capitalize tracking-wider">
            {tipo}
          </p>
        </div>

        <div className="flex gap-2 text-gray-400">
          <button className="hover:text-blue-600 transition-colors">
            <Pencil size={18} />
          </button>
          <button className="hover:text-red-600 transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-gray-900 text-lg font-semibold leading-tight">
          {titulo}
        </h1>

        <p className="text-gray-500 font-normal text-sm line-clamp-3">
          {descricao}
        </p>
      </div>

      <div className="flex flex-row gap-1 items-center pt-2">
        <ExternalLink size={16} className="text-blue-600" />
        <a
          className="text-blue-600 hover:underline text-sm font-medium truncate"
          href={url}
          target="_blank"
          rel="noreferrer"
        >
          {url}
        </a>
      </div>

      <div className="flex flex-wrap gap-2 pt-3">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-slate-100 text-slate-600 rounded-full px-3 py-1 text-xs font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default CardFeatures;
