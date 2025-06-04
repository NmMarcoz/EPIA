use reqwest;
use reqwest::Client;
use serde::{Deserialize, Serialize};
use crate::{utils, SectorUpdate};

//const BASE_URL: &str = "https://r97rgdpr-3000.brs.devtunnels.ms";

const BASE_URL: &str = "http://localhost:3000";

#[derive(Debug)]
pub enum ApiError {
    RequestError(reqwest::Error),
    JsonError(String),
}

impl From<reqwest::Error> for ApiError {
    fn from(err: reqwest::Error) -> Self {
        ApiError::RequestError(err)
    }
}

#[derive(Serialize,Deserialize)]
pub struct Worker {
    pub id: String,
    pub name: String,
    pub registrationNumber: String,
    pub email: String,
    pub function: String,
    pub cardId: String,
    #[serde(rename = "type")]
    pub r#type: Option<String>
}

pub async fn get_worker(card_id: String) -> Result<Worker, ApiError> {
    println!("Iniciando busca do worker com card_id: {}", card_id);
    let url = format!("{}/workers/cardId/{}", BASE_URL, card_id);
    println!("{}", url);
    let resp = reqwest::get(url)
        .await?;
    
    let worker: Worker = resp.json()
        .await
        .map_err(|e| ApiError::JsonError(e.to_string()))?;
    utils::jsonutils::pretty_json(&worker);
    Ok(worker)
}


#[derive(Serialize,Deserialize)]
pub struct Sector{
    pub name: String,
    pub code: String,
    pub rules: Vec<String>
}
pub async fn get_sector_by_code(code:String)->Result<Sector, ApiError>{
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(10))
        .build()
        .map_err(|e| ApiError::JsonError(e.to_string()))?;
    let url = format!("{}/sectors/{}", BASE_URL, code);
    let resp = client.get(url);
    let sector: Sector = resp.send()
        .await?
        .json()
        .await?;

    Ok(sector)
}

pub async fn update_sector(sector:SectorUpdate, code:String)->Result<Sector, ApiError>{
    let url = format!("{}/sectors/{}", BASE_URL, code);
    let resp = reqwest::Client::new()
        .put(url)
        .json(&sector)
        .send()
        .await?;
    let sector: Sector = resp.json()
        .await
        .map_err(|e| ApiError::JsonError(e.to_string()))?;
    Ok(sector)
}