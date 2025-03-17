import ReactMarkdown from "react-markdown";

const CustomH2 = ({ children }) => (
    <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{children}</h2>
);

const CustomH3 = ({ children }) => (
    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-200">{children}</h3>
);

const CustomH4 = ({ children }) => (
    <h4 className="text-base font-bold mb-2 text-gray-800 dark:text-gray-300">{children}</h4>
);

const CustomH5 = ({ children }) => (
    <h5 className="text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">{children}</h5>
);

const CustomH6 = ({ children }) => (
    <h6 className="text-xs font-bold mb-2 text-gray-600 dark:text-gray-400">{children}</h6>
);

const CustomParagraph = ({ children }) => (
    <p className="text-gray-800 dark:text-gray-300 leading-relaxed mb-2">{children}</p>
);

export default function ReactMarkDownCustom({ children }, ...props) {
    return (
        <ReactMarkdown
            components={{
                h2: CustomH2,
                h3: CustomH3,
                h4: CustomH4,
                h5: CustomH5,
                h6: CustomH6,
                p: CustomParagraph,
            }}
            {...props}
        >
            {children}
        </ReactMarkdown>
    );
}
