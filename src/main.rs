extern crate cmdparser;

use cmdparser::Parser;
use log::trace;
use log::{error, LevelFilter};
use rustyline::error::ReadlineError;
use rustyline::Editor;
use std::fs;
use green_copper_runtime::moduleloaders::{HttpModuleLoader, FileSystemModuleLoader};
use quickjs_runtime::quickjs_utils::modules::detect_module;
use quickjs_runtime::builder::QuickJsRuntimeBuilder;
use quickjs_runtime::facades::QuickJsRuntimeFacade;
use quickjs_runtime::jsutils::Script;
use quickjs_runtime::values::JsValueFacade;
use typescript_utils::TargetVersion;

fn main() {

    let (arguments, flags) = Parser::new().merge_values(true).parse();

    if flags.contains(&"v".to_string()) {
        simple_logger::SimpleLogger::new()
            .with_module_level("quickjs_runtime::features::console", LevelFilter::max())
            .with_module_level("ureq::unit", LevelFilter::Error)
            .with_level(LevelFilter::Trace)
            .init()
            .unwrap();
    } else {
        simple_logger::SimpleLogger::new()
            .with_level(LevelFilter::Info)
            .with_module_level("quickjs_runtime::features::console", LevelFilter::max())
            .with_module_level("ureq::unit", LevelFilter::Error)
            .init()
            .unwrap();
    }

    let fsl = FileSystemModuleLoader::new("./");
    let wsl = HttpModuleLoader::new()
        .validate_content_type(false)
        .secure_only();

    let ts_pp = typescript_utils::TypeScriptPreProcessor::new(TargetVersion::Es2020, false, false, false);

    let rt_builder = QuickJsRuntimeBuilder::new()
        .js_script_module_loader(fsl)
        .js_script_module_loader(wsl)
        .js_script_pre_processor(ts_pp);

    // todo greco should add a httpsecurity module to the builder
    // or a httpclientfactory, used for modules an fetch (or split those two so we can prevent modules being loaded from a data provider)
    let rt_builder = green_copper_runtime::init_greco_rt(rt_builder);

    let rt = rt_builder.build();

    let f_opt = arguments.get("f");
    if let Some(f) = f_opt {
        for file_name_string in f {
            let read_res = fs::read_to_string(&file_name_string);
            if read_res.is_ok() {
                let contents = read_res.ok().unwrap();
                trace!("evaluating: {}", contents);
                let is_module = detect_module(contents.as_str());

                let res = match is_module {
                    true => {
                        rt.eval_module_sync(None, Script::new(format!("file:///{}", file_name_string.as_str()).as_str(), contents.as_str()))
                    }
                    false => {
                        rt.eval_sync(None, Script::new(format!("file:///{}", file_name_string.as_str()).as_str(), contents.as_str()))
                    }
                };

                if res.is_err() {
                    error!("error during eval: {}", res.err().unwrap());
                }
            } else {
                error!("could not read file {}", read_res.err().unwrap());
            }
        }
    } else {
        println!("no files to run specified, use -f filename");
    }

    if flags.contains(&"i".to_string()) {
        interactive_mode(&rt);
    }
}

fn interactive_mode(rt: &QuickJsRuntimeFacade) {
    println!("press CTRL-D or CTRL-C to exit GreCo...");

    let mut rl = Editor::<()>::new();
    if rl.load_history("greco_history.txt").is_err() {
        // println!("No previous history.");
    }

    loop {
        let readline = rl.readline(">> ");
        match readline {
            Ok(line) => {
                rl.add_history_entry(line.as_str());

                let is_module = detect_module(line.as_str());

                let res = match is_module {
                    true => {
                        rt.eval_module_sync(None, Script::new("file:///input.ts", line.as_str())).map(|_| JsValueFacade::Null)
                    }
                    false => {
                        rt.eval_sync(None, Script::new("file:///input.ts", line.as_str()))
                    }
                };

                match res {
                    Ok(jsvf) => {
                        println!("{:?}", jsvf.stringify());
                    }
                    Err(e) => {
                        println!("{}", e);
                    }
                }
            }
            Err(ReadlineError::Interrupted) => {
                println!("CTRL-C");
                break;
            }
            Err(ReadlineError::Eof) => {
                println!("CTRL-D");
                break;
            }
            Err(err) => {
                println!("Error: {:?}", err);
                break;
            }
        }
    }
    rl.save_history("greco_history.txt").unwrap();
}

#[cfg(test)]
pub mod tests {
    #[test]
    fn test_cmd() {
        // todo refactor main so we can also start with args from scripts
        assert_eq!(1, 1);
    }
}
