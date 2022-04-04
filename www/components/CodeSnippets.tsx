import { ClipboardCheckIcon, ClipboardIcon } from "@heroicons/react/outline";
import classnames from "classnames";
import { useEffect, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import rust from "react-syntax-highlighter/dist/cjs/languages/prism/rust";
import oneDark from "react-syntax-highlighter/dist/cjs/styles/prism/one-dark";
import { useCopyToClipboard, useWindowSize } from "react-use";

SyntaxHighlighter.registerLanguage("rust", rust);

export default function CodeSnippets() {
  const [activeTab, setActiveTab] = useState(0);
  const [copyToClipboardState, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);
  useWindowSize();

  useEffect(() => {
    if (false) return undefined;

    let timeout = setTimeout(() => {
      setCopied(false);
    }, 1500);

    return () => void clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="mb-4 lg:col-span-5">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-200 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 max-w-2xl text-xl text-gray-300 sm:mt-4">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ipsa
            libero labore natus atque, ducimus sed.
          </p>
        </div>
        <div className="lg:col-span-7">
          <div className="mb-4">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">
                Select a tab
              </label>

              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded bg-gray-600 text-gray-300"
                defaultValue={tabs[activeTab].name}
                onChange={(e) => void setActiveTab(parseInt(e.target.value))}
              >
                {tabs.map((tab, index) => (
                  <option key={index} value={index}>
                    {tab.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <nav className="flex space-x-4" aria-label="Tabs">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => void setActiveTab(index)}
                    className={classnames(
                      "z-10 cursor-pointer rounded px-3 py-2 text-sm font-medium hover:shadow-md",
                      {
                        "bg-brand-orange2 text-white": activeTab === index,
                        "text-gray-300 hover:bg-gray-600 hover:text-gray-200":
                          activeTab !== index,
                      }
                    )}
                    aria-current={activeTab === index ? "page" : undefined}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>
          <div className="relative my-2 rounded bg-[#282C34] p-4 shadow-lg">
            <button
              type="button"
              className="absolute right-2 top-2 inline-flex items-center rounded border border-transparent bg-dark-800 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-dark-700"
              onClick={() => {
                copyToClipboard(tabs[activeTab].code);
                setCopied(true);
              }}
            >
              {copied ? (
                <>
                  <ClipboardCheckIcon
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Copied
                </>
              ) : (
                <>
                  <ClipboardIcon
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Copy
                </>
              )}
            </button>
            <SyntaxHighlighter
              className="!m-0 h-[450px] overflow-scroll !p-0"
              language="rust"
              style={oneDark}
              showLineNumbers
              lineNumberStyle={{
                width: "3.25em",
                position: "sticky",
                left: 0,
                background: "#282C34",
              }}
            >
              {tabs[activeTab].code}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}

const CARGO_DEPLOYS = `
$ cargo shuttle deploy
   Packaging url-shortener v0.1.0 (/private/shuttle/examples/url-shortener)
   Archiving Cargo.toml
   Archiving Cargo.toml.orig
   Archiving README.md
   Archiving Shuttle.toml
   Archiving migrations/20220324143837_urls.sql
   Archiving src/lib.rs
   Compiling tracing-attributes v0.1.20
   Compiling tokio-util v0.6.9
   Compiling multer v2.0.2
   Compiling hyper v0.14.18
   Compiling rocket_http v0.5.0-rc.1
   Compiling rocket_codegen v0.5.0-rc.1
   Compiling rocket v0.5.0-rc.1
   Compiling shuttle-service v0.2.5
   Compiling url-shortener v0.1.0 (/opt/unveil/crates/s-2)
    Finished dev [unoptimized + debuginfo] target(s) in 1m 01s

        Project:            url-shortener
        Deployment Id:      3d08ac34-ad63-41c1-836b-99afdc90af9f
        Deployment Status:  DEPLOYED
        Host:               url-shortener.shuttleapp.rs
        Created At:         2022-04-01 08:32:34.412602556 UTC
        Database URI:       postgres://***:***@pg.shuttle.rs/db-url-shortener

❯
`.trim();

const USING_SQLX = `
use rocket::{Build, Rocket};
use sqlx::PgPool;

struct MyState(PgPool);

#[get("/hello")]
fn hello(state: &State<MyState>) -> &'static str {
    // Do things with \`state.0\`...
    "Hello, Postgres!"
}

#[shuttle_service::main]
async fn rocket(
    pool: PgPool
) -> Result<Rocket<Build>, shuttle_service::Error> {
    let state = MyState(pool);
    Ok(rocket::build().manage(state).mount("/", routes![hello]))
}
`.trim();

const HELLO_CLOUD = `
use rocket::{Build, Rocket};

#[get("/hello")]
fn hello() -> &'static str {
    "Hello, world!"
}

#[shuttle_service::main]
async fn init() -> Result<Rocket<Build>, shuttle_service::Error> {
    Ok(rocket::build().mount("/", rocket::routes![hello]))
}
`.trim();

const USING_AXUM = `
use axum::{routing::get, Router};
use sync_wrapper::SyncWrapper;

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_service::main]
async fn axum() -> Result<SyncWrapper<Router>, shuttle_service::Error> {
    let router = Router::new().route("/hello", get(hello_world));
    let sync_wrapper = SyncWrapper::new(router);

    Ok(sync_wrapper)
}
`.trim();

const tabs = [
  { name: "Cargo Deploys", code: CARGO_DEPLOYS },
  { name: "Hello Cloud", code: HELLO_CLOUD },
  { name: "Using Sqlx", code: USING_SQLX },
  { name: "Using Axum", code: USING_AXUM },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
