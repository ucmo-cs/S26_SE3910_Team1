package com.se3910.team1.backend.exception;

public class SlotAlreadyBookedException extends RuntimeException {

	public SlotAlreadyBookedException() {
		super("That time slot is no longer available for this branch.");
	}
}
