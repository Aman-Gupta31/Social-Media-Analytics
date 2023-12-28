
# Social Media Analytics Microservice

Welcome to the Social Media Analytics Microservice project! This microservice is designed to handle the creation, retrieval, and analysis of social media posts in a scalable and efficient manner.

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Express.js (Node.js framework)
- **Database:** MySQL
- **Additional:** IP-based rate limiting for enhanced security

## Setup and Run

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Aman-Gupta31/socialmedia-analytics-app.git
   cd socialmedia-analytics-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Database:**
   - Create a MySQL database and update the configuration in `config/database.js`.

4. **Run the Application:**
   ```bash
   npm start
   ```
   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## API Endpoints

1. **Post Creation:**
   - Endpoint: `POST /api/v1/posts/`
   - Accepts a JSON payload with text content and a unique identifier.

2. **GET Analysis:**
   - Endpoint: `GET /api/v1/posts/{id}/analysis/`
   - Returns the number of words and average word length in a post.

## Infrastructure and Scaling Write-up

### Database Choice:

We opted for MySQL as our database due to its reliability, ACID compliance, and mature support for complex queries. It ensures data consistency, which is crucial for a social media analytics platform.

### Caching Mechanism:

Implementing a caching mechanism is essential for scalability. We recommend using a caching layer (e.g., Redis) to store frequently accessed data, reducing the load on the database and improving response times.

### IP-based Rate Limiting:

To enhance security, we implemented IP-based rate limiting. This prevents abuse and ensures fair usage of the APIs, protecting the service from potential DDoS attacks.

## Assumptions and Decisions

1. **Choice of Tech Stack:**
   - We chose Express.js for its simplicity, flexibility, and excellent support for building RESTful APIs. MySQL was chosen as it aligns with the relational data nature of social media posts.

2. **Scalability:**
   - We designed the microservice with scalability in mind by choosing technologies that support horizontal scaling. The caching mechanism and rate limiting contribute to the overall scalability and performance of the system.

3. **Security:**
   - IP-based rate limiting was implemented to mitigate potential security threats. It ensures that the API is not misused or overwhelmed by excessive requests from a single IP address.

4. **Caching:**
   - The caching mechanism implemented is based on post ID and is independent of post content. This decision aims to optimize retrieval times for frequently accessed posts without being affected by the variability in post content.


```