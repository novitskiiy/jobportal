package com.jobportal.utility;

import java.security.SecureRandom;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import com.jobportal.entity.Sequence;
import com.jobportal.exception.JobPortalException;

@Component
public class Utilities {
	private static final Logger logger = LoggerFactory.getLogger(Utilities.class);
	private static MongoOperations mongoOperation;

	@Autowired
	public void setMongoOperation(MongoOperations mongoOperation) {
		Utilities.mongoOperation = mongoOperation;
	}

	public static Long getNextSequenceId(String key) throws JobPortalException {
		try {
			logger.debug("Getting next sequence ID for key: {}", key);
			
			Query query = new Query(Criteria.where("_id").is(key));
			Update update = new Update();
			update.inc("seq", 1);
			FindAndModifyOptions options = new FindAndModifyOptions();
			options.returnNew(true);
			
			logger.debug("Executing findAndModify operation");
			Sequence seqId = mongoOperation.findAndModify(query, update, options, Sequence.class);
			
			if (seqId == null) {
				logger.error("Failed to get sequence ID for key: {}", key);
				throw new JobPortalException("Unable to get sequence id for key : " + key);
			}

			logger.debug("Generated sequence ID: {} for key: {}", seqId.getSeq(), key);
			return seqId.getSeq();
		} catch (Exception e) {
			logger.error("Error generating sequence ID for key: " + key, e);
			throw e;
		}
	}

	public static String generateOTP() {
		StringBuilder otp = new StringBuilder();
		SecureRandom secureRandom = new SecureRandom();
		for (int i = 0; i < 6; i++) {
			otp.append(secureRandom.nextInt(10));
		}
		return otp.toString();
	}
}
