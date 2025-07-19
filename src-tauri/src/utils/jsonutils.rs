use serde::Serialize;
use serde_json;

pub fn pretty_json<T: Serialize>(data: &T) -> Result<(), serde_json::Error> {
    let pretty = serde_json::to_string_pretty(&data)?;
    println!("{}", pretty);
    Ok(())
}
